export type CurrentUser = {
  sub: string;
  publicId: string;
  email?: string;
  roles: string[];
  businessPublicIds?: string[];
  hubPublicIds?: string[];
  driverPublicId?: string;
  driverPublicIds?: string[];
};
