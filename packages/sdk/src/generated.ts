
export interface GeneratedTypes {
  paths: Record<string, any>;
  components: Record<string, any>;
}

export type ApiPaths = GeneratedTypes['paths'];
export type ApiComponents = GeneratedTypes['components'];
