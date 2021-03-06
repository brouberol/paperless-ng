import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface DateSelection {
  before?: string
  after?: string
}

const FILTER_LAST_7_DAYS = 0
const FILTER_LAST_MONTH = 1
const FILTER_LAST_3_MONTHS = 2
const FILTER_LAST_YEAR = 3

@Component({
  selector: 'app-filter-dropdown-date',
  templateUrl: './filter-dropdown-date.component.html',
  styleUrls: ['./filter-dropdown-date.component.scss']
})
export class FilterDropdownDateComponent implements OnInit, OnDestroy {

  quickFilters = [
    {id: FILTER_LAST_7_DAYS, name: "Last 7 days"}, 
    {id: FILTER_LAST_MONTH, name: "Last month"},
    {id: FILTER_LAST_3_MONTHS, name: "Last 3 months"},
    {id: FILTER_LAST_YEAR, name: "Last year"}
  ]

  @Input()
  dateBefore: string

  @Input()
  dateAfter: string

  @Input()
  title: string

  @Output()
  datesSet = new EventEmitter<DateSelection>()

  private datesSetDebounce$ = new Subject()

  private sub: Subscription
  
  ngOnInit() {
    this.sub = this.datesSetDebounce$.pipe(
      debounceTime(400)
    ).subscribe(() => {
      this.onChange()
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  setDateQuickFilter(qf: number) {
    this.dateBefore = null
    let date = new Date()
    switch (qf) {
      case FILTER_LAST_7_DAYS:
        date.setDate(date.getDate() - 7)
        break;

      case FILTER_LAST_MONTH:
        date.setMonth(date.getMonth() - 1)
        break;

      case FILTER_LAST_3_MONTHS:
        date.setMonth(date.getMonth() - 3)
        break

      case FILTER_LAST_YEAR:
        date.setFullYear(date.getFullYear() - 1)
        break
  
      }
    this.dateAfter = formatDate(date, 'yyyy-MM-dd', "en-us", "UTC")
    this.onChange()
  }

  onChange() {
    this.datesSet.emit({after: this.dateAfter, before: this.dateBefore})
  }

  onChangeDebounce() {
    this.datesSetDebounce$.next({after: this.dateAfter, before: this.dateBefore})
  }

  clearBefore() {
    this.dateBefore = null;
    this.onChange()
  }

  clearAfter() {
    this.dateAfter = null;
    this.onChange()
  }

}
