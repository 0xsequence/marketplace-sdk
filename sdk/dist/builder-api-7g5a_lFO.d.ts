import { MarketplaceService } from "./new-marketplace-types-Cggo50UM.js";

//#region src/react/_internal/api/builder-api.d.ts
declare class BuilderAPI extends MarketplaceService {
  projectAccessKey?: string | undefined;
  jwtAuth?: string | undefined;
  constructor(hostname: string, projectAccessKey?: string | undefined, jwtAuth?: string | undefined);
  _fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
}
//#endregion
export { BuilderAPI };
//# sourceMappingURL=builder-api-7g5a_lFO.d.ts.map