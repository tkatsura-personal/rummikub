// api/hand.js
import { db } from './firebaseAdmin'; // adjust path to your Firebase admin setup

export default async function handler(req, res) {
  // Use GET query parameters instead of Express-style params
  const { gameId, userId } = req.query;

  if (!gameId || !userId) {
    return res.status(400).json({ error: 'Missing gameId or userId' });
  }

  try {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const gameData = gameDoc.data();
    const player = gameData.players.find(p => p.uid === userId);

    if (!player) {
      return res.status(404).json({ error: 'Player not found in this game' });
    }

    // Respond with player's hand
    res.status(200).json({ hand: player.hand });
  } catch (error) {
    console.error('Error fetching hand:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}