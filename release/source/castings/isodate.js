"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISODate = void 0;
/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
/**
 * Date helper class.
 */
let ISODate = class ISODate extends Class.Null {
    /**
     * Try to converts the specified value to a new ISO date object.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date object when the conversion was successful, otherwise returns the given value.
     */
    static Object(value, type) {
        if (value instanceof Array) {
            return value.map(value => this.Object(value, type));
        }
        else if (Date.parse(value)) {
            return new Date(value);
        }
        else {
            return value;
        }
    }
    /**
     * Try to converts the specified value to a new ISO date integer.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date integer when the conversion was successful, otherwise returns the given value.
     */
    static Integer(value, type) {
        if (value instanceof Array) {
            return value.map(value => this.Integer(value, type));
        }
        else if (value instanceof Date) {
            return Math.trunc(value.getTime() / 1000);
        }
        else if (Date.parse(value)) {
            return Math.trunc(new Date(value).getTime() / 1000);
        }
        else {
            return value;
        }
    }
    /**
     * Try to converts the specified value to a new ISO date string.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date string when the conversion was successful, otherwise returns the given value.
     */
    static String(value, type) {
        if (value instanceof Array) {
            return value.map(value => this.String(value, type));
        }
        else if (value instanceof Date) {
            const date = value.toISOString().substr(0, 19);
            const offset = value.getTimezoneOffset();
            const hours = Math.trunc(Math.abs(offset / 60)).toString();
            const mins = Math.trunc(Math.abs(offset % 60)).toString();
            return date + (offset < 0 ? '+' : '-') + hours.padStart(2, '0') + ':' + mins.padStart(2, '0');
        }
        else {
            return value;
        }
    }
};
__decorate([
    Class.Public()
], ISODate, "Object", null);
__decorate([
    Class.Public()
], ISODate, "Integer", null);
__decorate([
    Class.Public()
], ISODate, "String", null);
ISODate = __decorate([
    Class.Describe()
], ISODate);
exports.ISODate = ISODate;
//# sourceMappingURL=isodate.js.map