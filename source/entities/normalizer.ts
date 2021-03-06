/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';

import * as Types from '../types';
import * as Columns from '../columns';

import { Helper } from '../helper';
import { Schema } from '../schema';

/**
 * Normalizer helper class.
 */
@Class.Describe()
export class Normalizer extends Class.Null {
  /**
   * Creates a new normalized list based on the specified model type and entity list.
   * @param model Model type.
   * @param entities Entity list.
   * @param multiple Determines whether each value in the specified list can be a sub list.
   * @param alias Determines whether all column names should be aliased.
   * @param unsafe Determines whether all hidden columns should be visible.
   * @returns Returns the generated list.
   */
  @Class.Private()
  private static createList<I, O extends Types.Entity>(
    model: Types.ModelClass<I>,
    entities: (I | I[])[],
    multiple: boolean,
    alias: boolean,
    unsafe: boolean
  ): (O | O[])[] {
    const list = [];
    for (const entity of entities) {
      if (multiple && entity instanceof Array) {
        list.push(this.createList(model, entity, false, alias, unsafe));
      } else {
        list.push(this.createEntry(model, entity, alias, unsafe, false));
      }
    }
    return <(O | O[])[]>list;
  }

  /**
   * Create a new normalized map based on the specified model type and entity map.
   * @param model Model type.
   * @param entry Entity map.
   * @param alias Determines whether all column names should be aliased.
   * @param unsafe Determines whether all hidden columns should be visible.
   * @param unroll Determines whether all columns should be unrolled.
   * @param path Current path for unrolled values.
   * @param data Current data for unrolled values.
   * @returns Returns the generated map.
   */
  @Class.Private()
  private static createMap<I, O extends Types.Entity>(
    model: Types.ModelClass<I>,
    entry: Types.Map<I>,
    alias: boolean,
    unsafe: boolean
  ): Types.Map<O> {
    const map = <Types.Map<O>>{};
    for (const property in entry) {
      const entity = entry[property];
      if (entity !== void 0) {
        map[property] = this.createEntry(model, entity, alias, unsafe, false);
      }
    }
    return map;
  }

  /**
   * Creates a new normalized value from the specified column schema and entity value.
   * @param model Model type.
   * @param schema Column schema.
   * @param entity Entity value.
   * @param alias Determines whether all column names should be aliased.
   * @param unsafe Determines whether all hidden columns should be visible.
   * @param unroll Determines whether all columns should be unrolled.
   * @param path Current path for unrolled values.
   * @param data Current data for unrolled values.
   * @returns Returns the normalized value.
   * @throws Throws an error when the value isn't supported.
   */
  @Class.Private()
  private static createValue<I, O extends Types.Entity>(
    model: Types.ModelClass<I>,
    schema: Columns.Base<I>,
    entity: I | Types.Map<I> | (I | I[])[],
    alias: boolean,
    unsafe: boolean,
    unroll: boolean,
    path?: string,
    data?: Types.Entity
  ): O | I | Types.Map<O | I> | ((O | I) | (O | I)[])[] | undefined {
    if (schema.model && Schema.isEntity(schema.model)) {
      const nestedModel = Helper.getEntityModel(schema.model);
      if (entity instanceof Array) {
        if (schema.formats.includes(Types.Format.Array)) {
          const nestedMultiple = (<Columns.Virtual<I>>schema).all || false;
          return this.createList(nestedModel, entity, nestedMultiple, alias, unsafe);
        } else {
          throw new Error(`Column '${schema.name}@${Schema.getStorageName(model)}' doesn't support array types.`);
        }
      } else if (entity instanceof Object) {
        if (schema.formats.includes(Types.Format.Object)) {
          if (unroll) {
            return this.createEntry<Types.Entity, O>(nestedModel, entity, alias, unsafe, true, path, data), void 0;
          } else {
            return this.createEntry<Types.Entity, O>(nestedModel, entity, alias, unsafe, false);
          }
        } else if (schema.formats.includes(Types.Format.Map)) {
          return this.createMap(nestedModel, entity, alias, unsafe);
        } else {
          throw new Error(`Column '${schema.name}@${Schema.getStorageName(model)}' doesn't support object types.`);
        }
      }
    }
    return schema.caster(entity, Types.Cast.Normalize);
  }

  /**
   * Creates a new normalized entry based on the specified model type and entity value.
   * @param model Model type.
   * @param entity Entity value.
   * @param alias Determines whether all column names should be aliased.
   * @param unsafe Determines whether all hidden columns should be visible.
   * @param unroll Determines whether all columns should be unrolled.
   * @param path Current path for unrolled values.
   * @param data Current data for unrolled values.
   * @returns Returns the generated entry.
   */
  @Class.Private()
  private static createEntry<I, O extends Types.Entity>(
    model: Types.ModelClass<I>,
    entity: I,
    alias: boolean,
    unsafe: boolean,
    unroll: boolean,
    path?: string,
    data?: Types.Entity
  ): O {
    const schemas = Schema.getRows(model);
    const entry = <O>(data || {});
    for (const name in schemas) {
      const schema = schemas[name];
      const value = entity[<keyof I>name];
      if (value !== void 0 && (unsafe || !schema.hidden)) {
        let property = alias ? Columns.Helper.getName(schema) : schema.name;
        if (unroll) {
          property = path ? `${path}.${property}` : property;
        }
        const result = this.createValue(model, schema, value, alias, unsafe, unroll, property, entry);
        if (result !== void 0) {
          entry[<keyof O>property] = <O[keyof O]>result;
        }
      }
    }
    return entry;
  }

  /**
   * Creates a new normalized object based on the specified model type and entity.
   * @param model Model type.
   * @param entity Entity object.
   * @param alias Determines whether all column names should be aliased.
   * @param unsafe Determines whether all hidden columns should be visible.
   * @param unroll Determines whether all columns should be unrolled.
   * @returns Returns the generated object.
   */
  @Class.Public()
  public static create<I, O extends Types.Entity>(
    model: Types.ModelClass<I>,
    entity: I,
    alias?: boolean,
    unsafe?: boolean,
    unroll?: boolean
  ): O {
    return this.createEntry(model, entity, alias || false, unsafe || false, unroll || false);
  }
}
