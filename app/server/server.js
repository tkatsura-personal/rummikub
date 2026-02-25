
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const db = admin.firestore();

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
    console.log('Fetching table for gameId:', gameId);
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

    // Generate a random tile (Replace with actual tile generation logic)
    // Generate a list of all possible tiles (Combine R,O,U,K with numbers 1-13, then double it for two sets)
    const colors = ['R', 'O', 'U', 'K'];
    const numbers = Array.from({ length: 13 }, (_, i) => i + 1);
    const setTiles = colors.flatMap(color => numbers.map(num => `${color}${num}`));
    // Add jokers if needed (for example, two jokers)
    setTiles.push('J');
    const allTiles = [...setTiles, ...setTiles]; // Two sets of tiles
    
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
    gameData.players[playerIndex].hand.push(newTile);

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
    //console.log('Submitted table:', table);
    //console.log('Submitted hand:', hand);
    const endingTiles = [...hand];
    // Add tiles in each group on the table to endingTiles
    for (const group in table) {
      console.log(`Group ${group}:`, table[group]);
      endingTiles.push(...table[group]);
    }
    console.log('Ending tiles after submitting turn:', endingTiles);


    // Read current table and hand data from game document
    const currentTable = gameData.table;
    const currentHand = gameData.players[playerIndex].hand;

    const startingTiles = [...currentHand];
    for (const group in currentTable) {
      startingTiles.push(...currentTable[group]);
    }
    console.log('Starting tiles before submitting turn:', startingTiles);

    // Check if the submitted turn is valid by comparing the starting tiles and ending tiles
    if (!equalLists(startingTiles, endingTiles)) {
      return res.status(400).json({ error: 'Invalid turn: Tiles do not match starting hand and table' });
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