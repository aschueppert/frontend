import { Authing } from "./app";
import { DraftAuthorNotMatchError, DraftDoc } from "./concepts/drafting";
import { EventDoc, EventHostNotMatchError } from "./concepts/events";
import { AlreadyFollowingError, FollowDoc, NotFollowingError } from "./concepts/following";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/posting";
import { SaveAuthorNotMatchError, SaveDoc } from "./concepts/saving";
import { Router } from "./framework/router";
/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const approvers = post.approvers.map(async (approver) => await Authing.getUserById(approver));
    const full_approvers = await Promise.all(approvers);
    const approvers_usernames = full_approvers.map((approver) => approver.username);
    const approved = post.approved.map(async (approver) => await Authing.getUserById(approver));
    const full_approved = await Promise.all(approved);
    const approved_usernames = full_approved.map((approver) => approver.username);
    return { ...post, approvers: approvers_usernames, approved: approved_usernames };
  }

  static async save(save: SaveDoc | null) {
    console.log("Save", save);
    if (!save) {
      return save;
    }
    const author = await Authing.getUserById(save.author);
    const author_username = author.username;
    return { ...save, author: author_username };
  }
  static async draft(draft: DraftDoc | null) {
    if (!draft) {
      return draft;
    }
    const members = draft.members.map(async (member) => await Authing.getUserById(member));
    const full_members = await Promise.all(members);
    const usernames = full_members.map((member) => member.username);
    return { ...draft, members: usernames };
  }

  static async event(event: EventDoc | null) {
    if (!event) {
      return event;
    }
    const hosts = event.hosts.map(async (host) => await Authing.getUserById(host));
    const all_hosts = await Promise.all(hosts);
    const host_usernames = all_hosts.map((host) => host.username);
    const all_attendees = event.attendees.map(async (attendee) => await Authing.getUserById(attendee));
    const attendees_usernames = (await Promise.all(all_attendees)).map((attendee) => attendee.username);
    return { ...event, hosts: host_usernames, attendees: attendees_usernames };
  }
  static async follow(follow: FollowDoc | null) {
    if (!follow) {
      return follow;
    }
    const follower = await Authing.getUserById(follow.follower);
    const followee = await Authing.getUserById(follow.following);
    const follower_username = follower.username;
    const followee_username = followee.username;
    return { ...follow, follower: follower_username, followee: followee_username };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const approvers = posts.map((post) => post.approvers);
    const approved = posts.map((post) => post.approved);
    const approve_usernames = approvers.map(async (approve) => await Authing.idsToUsernames(approve));
    const approved_usernames = approved.map(async (approve) => await Authing.idsToUsernames(approve));
    const usernames1 = await Promise.all(approve_usernames);
    const usernames2 = await Promise.all(approved_usernames);
    return posts.map((post, i) => ({ ...post, approvers: usernames1[i], approved: usernames2[i] }));
  }

  static async drafts(drafts: DraftDoc[]) {
    const members = drafts.map((draft) => draft.members);
    const member_usernames = members.map(async (member_set) => await Authing.idsToUsernames(member_set));
    const usernames = await Promise.all(member_usernames);
    return drafts.map((draft, i) => ({ ...draft, members: usernames[i] }));
  }

  static async follows(follows: FollowDoc[]) {
    const followers = follows.map((follow) => follow.follower);
    const followees = follows.map((follow) => follow.following);
    const usernames = await Authing.idsToUsernames(followers.concat(followees));
    return follows.map((follow, i) => ({ ...follow, follower: usernames[i], following: usernames[i + follows.length] }));
  }
  static async events(events: EventDoc[]) {
    const hosts = events.map((event) => event.hosts);
    const attendees = events.map((event) => event.attendees);
    const host_usernames = hosts.map(async (host_set) => await Authing.idsToUsernames(host_set));
    const attendee_usernames = attendees.map(async (attendee_set) => await Authing.idsToUsernames(attendee_set));
    const hostnames = await Promise.all(host_usernames);
    const attendeenames = await Promise.all(attendee_usernames);
    return events.map((event, i) => ({ ...event, hosts: hostnames[i], attendees: attendeenames[i] }));
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(DraftAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(EventHostNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.host)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(SaveAuthorNotMatchError, async (e) => {
  const username = (await Authing.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(AlreadyFollowingError, async (e) => {
  console.log("Already following error");
  const user2 = (await Authing.getUserById(e.user2)).username;
  return e.formatWith(user2);
});
Router.registerError(NotFollowingError, async (e) => {
  const user2 = (await Authing.getUserById(e.user2)).username;
  return e.formatWith(user2);
});
