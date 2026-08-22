import { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as communityService from "./community.service";
import type { CommunityTripsQuery, AddCommentDto, PaginationQuery } from "./community.types";

async function getCommunityTrips(req: Request, res: Response) {
  const query = req.query as unknown as CommunityTripsQuery;
  const data = await communityService.getCommunityTrips(query);
  ok(res, data);
}

async function getPublicTrip(req: Request, res: Response) {
  const data = await communityService.getPublicTripById(req.params.id as string);
  ok(res, data);
}

async function likeTrip(req: Request, res: Response) {
  await communityService.likeTrip(req.params.id as string, req.user!.id);
  ok(res, null, 201);
}

async function unlikeTrip(req: Request, res: Response) {
  await communityService.unlikeTrip(req.params.id as string, req.user!.id);
  ok(res, null);
}

async function getTripComments(req: Request, res: Response) {
  const query = req.query as unknown as PaginationQuery;
  const data = await communityService.getTripComments(req.params.id as string, query);
  ok(res, data);
}

async function addComment(req: Request, res: Response) {
  const body = req.body as AddCommentDto;
  const data = await communityService.addComment(req.params.id as string, req.user!.id, body);
  ok(res, data, 201);
}

async function deleteComment(req: Request, res: Response) {
  await communityService.deleteComment(req.params.id as string, req.user!.id, req.user!.role);
  ok(res, null);
}

async function getPublicProfile(req: Request, res: Response) {
  const data = await communityService.getPublicProfile(req.params.id as string);
  ok(res, data);
}

async function followUser(req: Request, res: Response) {
  await communityService.followUser(req.user!.id, req.params.id as string);
  ok(res, null, 201);
}

async function unfollowUser(req: Request, res: Response) {
  await communityService.unfollowUser(req.user!.id, req.params.id as string);
  ok(res, null);
}

async function getPersonalizedFeed(req: Request, res: Response) {
  const query = req.query as unknown as PaginationQuery;
  const data = await communityService.getPersonalizedFeed(req.user!.id, query);
  ok(res, data);
}

export const communityController = {
  getCommunityTrips,
  getPublicTrip,
  likeTrip,
  unlikeTrip,
  getTripComments,
  addComment,
  deleteComment,
  getPublicProfile,
  followUser,
  unfollowUser,
  getPersonalizedFeed,
};
