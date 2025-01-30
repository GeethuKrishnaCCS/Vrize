// import { createGenerator } from "ts-json-schema-generator";

// /**
//  * Generate a JSON schema for a specified TypeScript type.
//  * @param typeFilePath Path to the TypeScript file containing the type.
//  * @param typeName Name of the TypeScript type/interface to generate the schema for.
//  * @returns The JSON schema as an object.
//  */
// export function generateJsonSchema(typeFilePath: string, typeName: string): object {
//   // Create the generator instance
//   const generator = createGenerator({
//     path: typeFilePath, // Path to the TypeScript file with the type
//     type: typeName, // The name of the TypeScript type/interface
//     expose: "all", // Include all properties (even optional)
//     skipTypeCheck: false, // Perform type checks
//   });

//   // Generate and return the JSON schema
//   return generator.createSchema(typeName);
// }
