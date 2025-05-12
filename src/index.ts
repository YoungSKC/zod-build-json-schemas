import { z, ZodType } from 'zod';
import zodToJsonSchema, { Targets, Options } from 'zod-to-json-schema';

type Models<Key extends string = string> = {
	readonly [K in Key]: ZodType<unknown>;
};

type SchemaKey<M extends Models> = M extends Models<infer Key> ? Key & string : never;

type ZodToJsonSchemaOptions = Omit<Partial<Options<Targets>>, 'basePath'>;
type BuildJsonSchemasOptions = ZodToJsonSchemaOptions & {
	readonly $id?: string;
};

type $Ref<M extends Models> = (key: SchemaKey<M>) => {
	readonly $ref: string;
	readonly description?: string;
};

type JsonSchema = {
	readonly $id: string;
};

type BuildJsonSchemasResult<M extends Models> = {
	readonly schemas: JsonSchema[];
	readonly $ref: $Ref<M>;
};

export const buildJsonSchemas = <M extends Models>(
	models: M,
	opts: BuildJsonSchemasOptions = {}
): BuildJsonSchemasResult<M> => {
	const zodSchema = z.object(models);

	const $id = opts.$id ?? `Schema`;

	const zodJsonSchema = zodToJsonSchema(zodSchema, {
		$refStrategy: 'none',
		...opts,
		basePath: [`${$id}#`],
	});

	const jsonSchema: JsonSchema = {
		$id,
		...zodJsonSchema,
	};

	const $ref: $Ref<M> = (key) => {
		const $ref = `${$id}#/properties/${key}`;
		return {
			$ref,
		};
	};

	return {
		schemas: [jsonSchema],
		$ref,
	};
};

export const createBuildJsonSchemas = (defaultOptions: BuildJsonSchemasOptions = {}) => {
	return <M extends Models>(models: M, opts: BuildJsonSchemasOptions = {}) =>
		buildJsonSchemas(models, { ...defaultOptions, ...opts });
};