
export function isDate(obj: any): obj is Date {
  return obj instanceof Date && !isNaN(obj.valueOf());
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

/**
     * Create a date object with ISO date time stamp of 0001-01-01T00:00:00.
    * @param v A property name.
    */
export function minDate() : Date {
    return new Date('0001-01-01T00:00:00')
}

export function todayWithoutTime() : Date {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var minDiffToUtc = date.getTimezoneOffset();
    date = new Date(date.getTime() -(minDiffToUtc*60000));
    return date;
}