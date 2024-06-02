import express from 'express';
import { getPlaylists, createPlaylist, getPlaylistById, getPlaylistByUserId, modifyPlaylist } from '../controllers/playlist.controller.js';

const playlistRouter = express.Router();

playlistRouter.get('/', getPlaylists);
playlistRouter.post('/', createPlaylist);
playlistRouter.get('/:user', getPlaylistByUserId)
playlistRouter.get('/:id', getPlaylistById)
playlistRouter.put('/:id', modifyPlaylist);

export default playlistRouter;
