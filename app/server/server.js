
import admin from "firebase-admin";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serviceAccount from './tk-rummikub-admin.json' with { type: 'json' };
import { specs, swaggerUi } from './swagger.js';

dotenv.config();

// Read private key from .env and add into serviceAccount object (since private key contains newlines, it can't be stored directly in the JSON file)
serviceAccount.private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
serviceAccount.private_key_id = process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID;
serviceAccount.client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
serviceAccount.client_id = process.env.FIREBASE_ADMIN_CLIENT_ID;
serviceAccount.client_x509_cert_url = process.env.FIREBASE_ADMIN_CLIENT_x509_CERT_URL;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const db = admin.firestore();

// Build the full 106-tile Rummikub pool: colors R/O/U/K x numbers 1-13, doubled, plus two jokers (J0)
function buildFullTileSet() {
  const colors = ['R', 'O', 'U', 'K'];
  const numbers = Array.from({ length: 13 }, (_, i) => i + 1);
  const setTiles = colors.flatMap(color => numbers.map(num => `${color}${num}`));
  setTiles.push('J0');
  return [...setTiles, ...setTiles];
}

// Fisher-Yates shuffle of a copy of the given array
function shuffle(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

/**
 * @swagger
 * /users:
 *    get:
 *      summary: Get all users
 *      description: Retrieve a list of all users
 *      tags: [Users]
 *      responses:
 *        '500': 
 *          description: Internal Server Error
 *        '201':
 *          description: A list of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      example: uid000
 *                    userName:
 *                      type: string
 *                      example: tkatsura
 *                    email:
 *                      type: string
 *                      example: tkatsura@example.com
 *                    createdAt:
 *                      type: object
 *                      properties:
 *                        _seconds:
 *                         type: integer
 *                         example: 1757574000
 *                        _nanoseconds:
 *                         type: integer
 *                         example: 160000000
 */
app.get('/users', async (req, res) => {
  try {
    const usersCol = await db.collection('users').get(); // Grab documents
    const users = usersCol.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map to array of user objects
    res.status(201).json(users); // Send as JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /games:
 *    get:
 *      summary: Get all games
 *      description: Retrieve a list of all games
 *      tags: [Games]
 *      responses:
 *        '500': 
 *         description: Internal Server Error
 *        '201':
 *          description: A list of games
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      example: game13578
 *                    active:
 *                      type: integer
 *                      example: 1
 *                    turnNumber:
 *                      type: integer
 *                      example: 2
 *                    winner:
 *                      type: string
 *                      example: null
 *                    createdAt:
 *                      type: object
 *                      properties:
 *                        _seconds:
 *                          type: integer
 *                          example: 1764144000
 *                        _nanoseconds:
 *                          type: integer
 *                          example: 316000000
 *                    updatedAt:
 *                      type: object
 *                      properties:
 *                        _seconds:
 *                          type: integer
 *                          example: 1764316800
 *                        _nanoseconds:
 *                          type: integer
 *                          example: 787000000
 *                    players:
 *                      type: array
 *                      items:
 *                        type: object
 *                        properties:
 *                          uid:
 *                            type: string
 *                            example: uid000
 *                    currentTurnIndex:
 *                      type: integer
 *                      example: 1
 * 
 * 
 */
app.get('/games', async (req, res) => {
  try {
    const gamesCol = await db.collection('games').get(); // Grab documents
    const games = gamesCol.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map to array of game objects
    // Remove detailed game data from the response to avoid sending too much data
    games.forEach(game => {
      delete game.table;
      game.players = game.players.map(player => ({ uid: player.uid })); // Only include uid for each player
    });
    res.status(201).json(games); // Send as JSON response
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /games:
 *    post:
 *      summary: Create a new game
 *      description: Create a new game with the given player limit; the creator is automatically added as the first player
 *      tags: [Games]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uid:
 *                  type: string
 *                  example: uid000
 *                playerCount:
 *                  type: integer
 *                  example: 3
 *      responses:
 *        '400':
 *          description: Missing uid, or playerCount not an integer between 2 and 4
 *        '500':
 *          description: Internal Server Error
 *        '201':
 *          description: The newly created game's ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    example: game13579
 */
app.post('/games', async (req, res) => {
  const { uid, playerCount } = req.body;
  if (typeof uid !== 'string' || !uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }
  if (!Number.isInteger(playerCount) || playerCount < 2 || playerCount > 4) {
    return res.status(400).json({ error: 'playerCount must be between 2 and 4' });
  }
  try {
    const newGameDoc = {
      active: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      currentTurnIndex: 0,
      turnNumber: 0,
      winner: null,
      playerCount,
      players: [{ uid, hand: { '1': [], '2': [], '3': [] } }],
      table: {},
    };
    const gameRef = await db.collection('games').add(newGameDoc);
    res.status(201).json({ id: gameRef.id });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /games/{gameId}/join:
 *    post:
 *      summary: Join a game
 *      description: Join an existing joinable game; if this join fills the game to its player limit, tiles are dealt and the game becomes active
 *      tags: [Games]
 *      parameters:
 *        - in: path
 *          name: gameId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the game to join
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                uid:
 *                  type: string
 *                  example: uid001
 *      responses:
 *        '404':
 *          description: Game not found
 *        '409':
 *          description: Game is not joinable, game is full, or uid has already joined
 *        '500':
 *          description: Internal Server Error
 *        '201':
 *          description: Join result
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    example: game13579
 *                  active:
 *                    type: integer
 *                    example: 1
 *                  playersJoined:
 *                    type: integer
 *                    example: 3
 *                  playerCount:
 *                    type: integer
 *                    example: 3
 */
app.post('/games/:gameId/join', async (req, res) => {
  const { gameId } = req.params;
  const { uid } = req.body;
  if (typeof uid !== 'string' || !uid) {
    return res.status(400).json({ error: 'Missing uid' });
  }
  try {
    const gameRef = db.collection('games').doc(gameId);
    const result = await db.runTransaction(async (tx) => {
      const gameDoc = await tx.get(gameRef);
      if (!gameDoc.exists) {
        throw { status: 404, error: 'Game not found' };
      }
      const gameData = gameDoc.data();
      if (gameData.active !== 0) {
        throw { status: 409, error: 'Game is not joinable' };
      }
      if (gameData.players.length >= gameData.playerCount) {
        throw { status: 409, error: 'Game is full' };
      }
      if (gameData.players.some(p => p.uid === uid)) {
        throw { status: 409, error: 'Already joined' };
      }

      const newPlayers = [...gameData.players, { uid, hand: { '1': [], '2': [], '3': [] } }];
      let table = gameData.table;
      let active = gameData.active;

      if (newPlayers.length === gameData.playerCount) {
        // This join fills the game: deal tiles and activate
        const pool = shuffle(buildFullTileSet());
        newPlayers.forEach((player) => {
          player.hand = { '1': pool.splice(0, 14), '2': [], '3': [] };
        });
        table = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [String(i + 1), []]));
        active = 1;
      }

      tx.update(gameRef, {
        players: newPlayers,
        table,
        active,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { id: gameId, active, playersJoined: newPlayers.length, playerCount: gameData.playerCount };
    });
    res.status(201).json(result);
  } catch (error) {
    if (error && error.status) {
      return res.status(error.status).json({ error: error.error });
    }
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /table/{gameId}:
 *    get:
 *      summary: Get table data for a game
 *      description: Retrieve the current table data for a specific game
 *      tags: [Games]
 *      parameters:
 *        - in: path
 *          name: gameId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the game to retrieve the table for
 *      responses:
 *        '404':
 *          description: Game not found
 *        '500':
 *          description: Internal Server Error
 *        '201':
 *          description: Table data for the specified game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  set1:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: ["R1", "R2", "R3"]
 */
app.get('/table/:gameId', async (req, res) => {
  const { gameId } = req.params;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get(); // Grab document by gameId
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const table = gameDoc.data().table; // Extract table data from document
    return res.status(201).json(table); // Send as JSON response
  } catch (error) {
    console.error('Error fetching table:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @swagger
 * /hand/{gameId}/{userId}:
 *    get:
 *      summary: Get player's hand for a game
 *      description: Retrieve the current hand for a specific player in a specific game
 *      tags: [Games]
 *      parameters:
 *        - in: path
 *          name: gameId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the game to retrieve the hand for
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the user to retrieve the hand for
 *      responses:
 *        '404':
 *          description: Game not found or player not found in game
 *        '500':
 *          description: Internal Server Error
 *        '201':
 *          description: Hand data for the specified player in the specified game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  items:
 *                    type: string
 *                    example: ["R1", "O5", "U12", "K7", "J"]
 */
app.get('/hand/:gameId/:userId', async (req, res) => {
  const { gameId, userId } = req.params;
  try {
    const gameDoc = await db.collection('games').doc(gameId).get(); // Grab game document by gameId
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const gameData = gameDoc.data();
    const player = gameData.players.find(p => p.uid === userId); // Find player in game by userId
    if (!player) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }
    return res.status(201).json({ hand: player.hand }); // Send player's hand as JSON response
  } catch (error) {
    console.error('Error fetching hand:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/** 
 * @swagger
 * /tile/{gameId}/{userId}:
 *    post:
 *      summary: Draw a tile for a player in a game
 *      description: Draw a random tile for a specific player in a specific game, ensuring it's the player's turn and the tile is valid
 *      tags: [Games]
 *      parameters:
 *        - in: path
 *          name: gameId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the game to draw a tile for
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the user to draw a tile for
 *      responses:
 *        '400':
 *          description: No more tiles available or not player's turn
 *        '404':
 *          description: Game not found or player not found in game
 *        '500':
 *          description: Internal Server Error
 *        '201':
 *          description: The new tile drawn for the player
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  newTile:
 *                    type: string
 *                    example: "R5"
 */
app.post('/tile/:gameId/:userId', async (req, res) => {
  const { gameId, userId } = req.params;
  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get(); // Grab game document by gameId
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const gameData = gameDoc.data();
    const playerIndex = gameData.players.findIndex(p => p.uid === userId); // Find player index in game by userId
    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }

    // Check if uid matches currentTurnId in game document to ensure it's the player's turn
    if (gameData.players[gameData.currentTurnIndex].uid !== userId) {
      return res.status(403).json({ error: 'Not your turn' });
    }

    // Generate a random tile from the full pool
    const allTiles = buildFullTileSet();
    
    // Grab all tiles currently in players' hands and on the table to determine which tiles are still available
    const handTiles = [];
    gameData.players.forEach(player => player.hand.forEach(tile => handTiles.push(tile)));
    const tableTiles = Object.values(gameData.table).flat();
    const allUsedTiles = [...handTiles, ...tableTiles];
    
    const usedCounts = {};
    for (const tile of allUsedTiles) {
      usedCounts[tile] = (usedCounts[tile] || 0) + 1;
    }

    // Build pile to pull from
    const availableTiles = [];
    for (const tile of allTiles) {
      if (usedCounts[tile]) {
        usedCounts[tile]--;
      } else {
        availableTiles.push(tile);
      }
    }

    if (availableTiles.length === 0) {
      return res.status(400).json({ error: 'No more tiles available' });
    }
    
    const newTile = availableTiles[Math.floor(Math.random() * availableTiles.length)]; // Randomly select a tile from available tiles

    // Add the new tile to the player's hand
    gameData.players[playerIndex].hand = ensureValidHand(gameData.players[playerIndex].hand);
    gameData.players[playerIndex].hand['1'].push(newTile);

    const currentIndex = gameData.currentTurnIndex;
    const nextIndex = (currentIndex + 1) % gameData.players.length;
    if (nextIndex === 0) {
      gameData.turnNumber += 1; // Increment round if we loop back to the first player
    }

    // Update the game document with the new hand, current turn index, and round in game document
    await gameRef.update({ players: gameData.players, currentTurnIndex: nextIndex, turnNumber: gameData.turnNumber });
    
    res.status(201).json({ newTile }); // Send the new tile as JSON response
  } catch (error) {
    console.error('Error generating tile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check if two lists are identical
function equalLists(list1, list2) {
  if (list1.length !== list2.length) return false;

  const counts = {};

  for (const tile of list1) {
    counts[tile] = (counts[tile] || 0) + 1;
  }

  for (const tile of list2) {
    if (!counts[tile]) return false;  // tile missing or too many
    counts[tile]--;
  }

  return true;
}

// Ensure a player's hand object has all three group arrays ('1','2','3'); repairs and logs
// if the stored/submitted hand is missing or malformed, rather than crashing downstream.
function ensureValidHand(hand) {
  const isPlainObject = hand && typeof hand === 'object' && !Array.isArray(hand);
  const normalized = isPlainObject ? hand : {};
  if (!isPlainObject) {
    console.warn('ensureValidHand: hand was missing/malformed, resetting to empty groups', hand);
  }
  for (const key of ['1', '2', '3']) {
    if (!Array.isArray(normalized[key])) {
      console.warn(`ensureValidHand: hand['${key}'] was missing/malformed, resetting to []`);
      normalized[key] = [];
    }
  }
  return normalized;
}

// Validate that a table group is a structurally legal Rummikub set: either a group of 3-4
// same-number tiles with all-different colors, or a run of 3+ consecutive same-color numbers.
// Sorts a copy of the tiles by number first so submitted order from the client cannot be used
// to evade or corrupt the check (ported from app/client/components/TileSet.tsx's checkSet).
function checkSet(tiles) {
  if (tiles.length === 0) return true;
  if (tiles.length < 3) return false;
  const getColor = (t) => t[0];
  const getNumber = (t) => parseInt(t.slice(1));
  const sorted = [...tiles].sort((a, b) => getNumber(a) - getNumber(b));
  const numbers = sorted.map(getNumber);
  const colors = sorted.map(getColor);
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size === 1) {
    // group: same number on every tile, all colors must be distinct
    return new Set(colors).size === sorted.length;
  }
  if (new Set(colors).size === 1) {
    // run: same color on every tile, numbers must be consecutive ascending (already sorted)
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] !== numbers[i - 1] + 1) return false;
    }
    return true;
  }
  return false;
}

/**
 * @swagger
 * /hand/{gameId}/{userId}:
 *    post:
 *      summary: Submit a player's turn for a game
 *      description: Submit the player's turn by providing the new hand and table data, ensuring it's the player's turn and the submitted turn is valid
 *      tags: [Games]
 *      parameters:
 *        - in: path
 *          name: gameId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the game to submit the turn for
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *          description: The ID of the user submitting the turn
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                table:
 *                  type: object
 *                  additionalProperties:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example:
 *                        set1: ["R1", "R2", "R3"]
 *                hand:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: ["R1", "O5", "U12", "K7", "J"]
 */
app.post('/hand/:gameId/:userId', async (req, res) => {
  const { gameId, userId } = req.params;
  try {
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get(); // Grab game document by gameId
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const gameData = gameDoc.data();
    const playerIndex = gameData.players.findIndex(p => p.uid === userId); // Find player index in game by userId
    if (playerIndex === -1) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }
    
    // Check if uid matches currentTurnId in game document to ensure it's the player's turn
    if (gameData.players[gameData.currentTurnIndex].uid !== userId) {
      return res.status(403).json({ error: 'Not your turn' });
    }

    const submittedTurn = req.body; // Get submitted turn data from request body
    
    // Split table and hand data from submitted turn
    const { table, hand } = submittedTurn;
    const endingTiles = [];
    for (const group in hand) {
      endingTiles.push(...hand[group]);
    }
    // Add tiles in each group on the table to endingTiles
    for (const group in table) {
      endingTiles.push(...table[group]);
    }


    // Read current table and hand data from game document
    const currentTable = gameData.table;
    const currentHand = ensureValidHand(gameData.players[playerIndex].hand);

    const startingTiles = [];
    for (const group in currentHand) {
      startingTiles.push(...currentHand[group]);
    }
    for (const group in currentTable) {
      startingTiles.push(...currentTable[group]);
    }

    // Check if the submitted turn is valid by comparing the starting tiles and ending tiles
    if (!equalLists(startingTiles, endingTiles)) {
      return res.status(400).json({ error: 'Invalid turn: Tiles do not match starting hand and table' });
    }

    // Check that every non-empty group placed on the table is a structurally legal set/run
    for (const group in table) {
      if (table[group].length > 0 && !checkSet(table[group])) {
        return res.status(400).json({ error: 'Invalid turn: table contains an invalid set', group });
      }
    }

    // If the turn is valid, update the game document with the new hand and table data
    gameData.table = table;
    gameData.players[playerIndex].hand = hand;

    // Move to the next player's turn and increment round if we loop back to the first player
    const currentIndex = gameData.currentTurnIndex;
    const nextIndex = (currentIndex + 1) % gameData.players.length;
    if (nextIndex === 0) {
      gameData.turnNumber += 1; // Increment round if we loop back to the first player
    }

    // Submit hand and table data to game document, along with next player's turn index and round number
    await gameRef.update({ table: gameData.table, players: gameData.players, currentTurnIndex: nextIndex, turnNumber: gameData.turnNumber });

    // Update the game document with the new hand
    // await game.update({ players: gameData.players });    
    res.status(201).json({ }); // Send the new tile as JSON response
  } catch (error) {
    console.error('Error submitting turn:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));