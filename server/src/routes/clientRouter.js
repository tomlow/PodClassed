import express from "express"
import getClientIndexPath from "../config/getClientIndexPath.js"

const router = new express.Router()

const clientRoutes = [
  "/",
  "/user-sessions/new",
  "/users/new",
  "/podcasts",
  "/genres",
  "/genres/:id",
  "/profile",
  "/genres/new",
  "/podcasts/new",
  "/podcasts/:id/edit",
  "/podcasts/:id/delete",
  "/genres/:id/edit",
  "/genres/:id/delete",
  "/podcasts/:id",
  '/reviews/:id/edit',
  '/reviews/:id/delete'
]
router.get(clientRoutes, (req, res) => {
  res.sendFile(getClientIndexPath())
})

export default router
