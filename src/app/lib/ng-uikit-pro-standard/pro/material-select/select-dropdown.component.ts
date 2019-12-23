import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation, ElementRef, HostListener, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Option } from './option';
import { OptionList } from './option-list';

@Component({
  selector: 'mdb-select-dropdown',
  templateUrl: 'select-dropdown.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [trigger('dropdownAnimation', [
    state('invisible', style({ opacity: 0, height: '0px' })),
    state('visible', style({ opacity: 1, height: '*' })),
    transition('invisible => visible', animate('300ms ease')),
    transition('visible => invisible', animate('300ms ease'))
  ])]
})
export class SelectDropdownComponent
  implements AfterViewInit, OnChanges, OnInit {

  @Input() filterEnabled: boolean;
  @Input() highlightColor: string;
  @Input() highlightTextColor: string;
  @Input() left: number;
  @Input() multiple: boolean;
  @Input() notFoundMsg: string;
  @Input() optionList: OptionList;
  @Input() top: number;
  @Input() width: number;
  @Input() placeholder: string;
  @Input() customClass = '';
  @Input() visibleOptions = 4;
  @Input() dropdownHeight: number;
  @Input() dropdownMaxHeight: number;
  @Input() optionHeight: number;
  @Input() enableSelectAll: boolean;
  @Output() close = new EventEmitter<boolean>();
  @Output() optionClicked = new EventEmitter<Option>();
  @Output() singleFilterClick = new EventEmitter<null>();
  @Output() singleFilterInput = new EventEmitter<string>();
  @Output() singleFilterKeydown = new EventEmitter<any>();
  @Output() selectAll = new EventEmitter<boolean>();

  @ViewChild('filterInput') filterInput: any;
  @ViewChild('optionsList') optionsList: any;
  @ViewChild('dropdownContent') dropdownContent: ElementRef;
  disabledColor = '#fff';
  disabledTextColor = '9e9e9e';

  // Used in sliding-down animation
  state = 'invisible';
  startHeight: any = 0;
  endHeight: any = 45;

  public hasOptionsItems = true;

  private selectAllSelected = false;

  constructor(public _elementRef: ElementRef, public _renderer: Renderer2, private cdRef: ChangeDetectorRef) { }

  /** Event handlers. **/

  // Angular life cycle hooks.

  @HostListener('keyup') onkeyup() {
    this.hasOptionsItems = this.optionList.filtered.length > 0;
    this.updateSelectAllState();
  }


  ngOnInit() {
    this.updateSelectAllState();
    this.optionsReset();
    this.setDropdownHeight();
    this.setVisibleOptionsNumber();
  }

  setDropdownHeight() {
    this._renderer.setStyle(this.optionsList.nativeElement, 'height', this.dropdownHeight + 'px');
  }

  setVisibleOptionsNumber() {
    this._renderer.setStyle(this.optionsList.nativeElement, 'max-height', this.dropdownMaxHeight + 'px');
  }

  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('optionList')) {
      this.optionsReset();
    }

    if (changes.hasOwnProperty('dropdownHeight')) {
      this.setDropdownHeight();
    }

    const container = this._elementRef.nativeElement.classList;
    setTimeout(() => { container.add('fadeInSelect'); }, 200);
  }

  ngAfterViewInit() {
    // Sliding-down animation
    this.endHeight = this.dropdownContent.nativeElement.clientHeight;
    this.state = (this.state === 'invisible' ? 'visible' : 'invisible');
    this.cdRef.detectChanges();

    // Dropping up dropdown content of Material Select when near bottom edge of the screen
    // Need fix to proper work with sliding animation

    // tslint:disable-next-line:max-line-length
    // if (window.innerHeight - this._elementRef.nativeElement.getBoundingClientRect().bottom < this.dropdownContent.nativeElement.clientHeight) {
    //   this._renderer.setStyle(this.dropdownContent.nativeElement, 'top', - this.dropdownContent.nativeElement.clientHeight + 'px');
    // }
    if (this.multiple) {
      this._elementRef.nativeElement.querySelectorAll('.disabled.optgroup').forEach((element: any) => {
        this._renderer.setStyle(element.firstElementChild.lastElementChild, 'display', 'none');
      });
    }

    this.moveHighlightedIntoView();
      if (this.filterEnabled) {
        this.filterInput.nativeElement.focus();
      }
  }
  // Filter input (single select).

  onSingleFilterClick() {
    this.singleFilterClick.emit(null);
  }

  onSingleFilterInput(event: any) {
    this.singleFilterInput.emit(event.target.value);
  }

  onSingleFilterKeydown(event: any) {
    this.singleFilterKeydown.emit(event);
  }

  // Options list.

  onOptionsWheel(event: any) {
    this.handleOptionsWheel(event);
  }

  onOptionClick(option: Option) {
    this.optionClicked.emit(option);
    this.updateSelectAllState();
  }

  /** Initialization. **/

  private optionsReset() {
    this.optionList.filter('');
    this.optionList.highlight();
  }

  /** View. **/

  getOptionStyle(option: Option): any {
    if (option.highlighted || option.hovered) {
      const optionStyle: any = {};
      optionStyle['height'] = this.optionHeight;
      if (typeof this.highlightColor !== 'undefined') {
        optionStyle['background-color'] = this.highlightColor;
      }
      if (typeof this.highlightTextColor !== 'undefined') {
        optionStyle['color'] = this.highlightTextColor;
      }
      return optionStyle;
    } else {
      return {};
    }
  }

  onSelectAllClick() {
    this.selectAllSelected = !this.selectAllSelected;
    this.selectAll.emit(this.selectAllSelected);
  }

  updateSelectAllState() {
    const areAllSelected = this.optionList.filtered.every( (option: Option) => {
      return option.selected ? true : false;
    });

   areAllSelected ? this.selectAllSelected = true : this.selectAllSelected = false;
   this.cdRef.detectChanges();
  }

  clearFilterInput() {
    if (this.filterEnabled) {
      this.filterInput.nativeElement.value = '';
    }
  }

  moveHighlightedIntoView() {
    let listHeight: number;
    const list = this.optionsList.nativeElement;
    listHeight = this.multiple && this.enableSelectAll ? list.offsetHeight - this.optionHeight : list.offsetHeight;

    const itemIndex = this.optionList.getHighlightedIndex();

    if (itemIndex > -1) {
      const item = list.children[0].children[itemIndex];
      const itemHeight = item.offsetHeight;

      const itemTop = itemIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;

      const viewTop = list.scrollTop;
      const viewBottom = viewTop + listHeight;

      if (itemBottom > viewBottom) {
        list.scrollTop = itemBottom - listHeight;
      } else if (itemTop < viewTop) {
        list.scrollTop = itemTop;
      }

    }
  }

  private handleOptionsWheel(e: any) {
    const div = this.optionsList.nativeElement;
    const atTop = div.scrollTop === 0;
    const atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

    if (atTop && e.deltaY < 0) {
      e.preventDefault();
    } else if (atBottom && e.deltaY > 0) {
      e.preventDefault();
    }

  }

}
