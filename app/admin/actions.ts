"use server";

import {
  performAdminLogin,
  performAdminSignOut,
  performArchiveTeam,
  performGenerateStructure,
  performRunAdminAssistant,
  performResetTournamentData,
  performSubmitResult,
  performUpsertAnnouncement,
  performUpsertMatch,
  performUpsertTeam
} from "@/server/actions/admin";

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

export async function resetTournamentDataAction(formData: FormData) {
  return performResetTournamentData(formData);
}

export async function runAdminAssistantAction(formData: FormData) {
  return performRunAdminAssistant(formData);
}

