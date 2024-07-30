export enum CollaboratorRole {
  Viewer = "viewer", // can't edit, can't invite and remove collaborators
  Editor = "editor", // can edit, can't invite and remove collaborators
  Admin = "amdin", // can edit, can invite and remove collaborators
  Owner = "owner", // can edit, can invite and remove collaborators, can't be removed, this role can't be assigend, only one who can delete the plan
}
