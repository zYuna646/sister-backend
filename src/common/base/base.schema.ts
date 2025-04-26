import { Schema, PopulateOptions } from 'mongoose';

export class BaseSchema extends Schema {
  constructor(
    schemaDefinition: object,
    populateDefinition: string[] | Record<string, any> = [],
  ) {
    const baseSchemaDefinition = {
      ...schemaDefinition,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    };

    super(baseSchemaDefinition);

    this.methods.toJSON = function () {
      const obj = this.toObject();
      delete obj.__v;
      return obj;
    };

    this.pre('findOne', function (next) {
      // Handle both array and object formats for populate
      if (Array.isArray(populateDefinition) && populateDefinition.length > 0) {
        // Handle array of path strings: ['path1', 'path2']
        populateDefinition.forEach((path: string) => {
          this.populate(path);
        });
      } else if (
        typeof populateDefinition === 'object' &&
        Object.keys(populateDefinition).length > 0
      ) {
        // Handle object format with paths
        for (const key in populateDefinition) {
          if (Object.prototype.hasOwnProperty.call(populateDefinition, key)) {
            const option = populateDefinition[key] as PopulateOptions;
            this.populate(option);
          }
        }
      }
      next();
    });

    this.pre('find', function (next) {
      // Handle both array and object formats for populate
      if (Array.isArray(populateDefinition) && populateDefinition.length > 0) {
        // Handle array of path strings: ['path1', 'path2']
        populateDefinition.forEach((path: string) => {
          this.populate(path);
        });
      } else if (
        typeof populateDefinition === 'object' &&
        Object.keys(populateDefinition).length > 0
      ) {
        // Handle object format with paths
        for (const key in populateDefinition) {
          if (Object.prototype.hasOwnProperty.call(populateDefinition, key)) {
            const option = populateDefinition[key] as PopulateOptions;
            this.populate(option);
          }
        }
      }
      next();
    });

    this.pre('save', function (next) {
      this.updatedAt = new Date();
      next();
    });
  }
}
