/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Match } from './match';
import { Limit } from './limit';
import { Sort } from './sort';

/**
 * Filter statement interface.
 */
export interface Filter {
  /**
   * Matching fields.
   */
  match: Match | Match[];
  /**
   * Sorting fields.
   */
  sort: Sort;
  /**
   * Limit results.
   */
  limit: Limit;
}
