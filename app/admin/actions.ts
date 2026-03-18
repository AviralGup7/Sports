"use server";

import { performUpsertAnnouncement } from "@/lib/admin-actions/announcements";
import { performAdminLogin, performAdminSignOut } from "@/lib/admin-actions/auth";
import { performGenerateStructure, performSubmitResult, performUpsertMatch } from "@/lib/admin-actions/matches";
import { performArchiveTeam, performUpsertTeam } from "@/lib/admin-actions/teams";

export async function loginAdminAction(formData: FormData) {
  return performAdminLogin(formData);
}

export async function signOutAdminAction() {
  return performAdminSignOut();
}

export async function upsertTeamAction(formData: FormData) {
  return performUpsertTeam(formData);
}

export async function archiveTeamAction(formData: FormData) {
  return performArchiveTeam(formData);
}

export async function upsertMatchAction(formData: FormData) {
  return performUpsertMatch(formData);
}

export async function generateStructureAction(formData: FormData) {
  return performGenerateStructure(formData);
}

export async function submitResultAction(formData: FormData) {
  return performSubmitResult(formData);
}

export async function upsertAnnouncementAction(formData: FormData) {
  return performUpsertAnnouncement(formData);
}
