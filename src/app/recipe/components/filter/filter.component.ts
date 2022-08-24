import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'irecipe-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Output() filterData: EventEmitter<string> = new EventEmitter();

  filter!: string;
  colorTheme!: string;

  constructor(private settingService: SettingsService) {}

  ngOnInit(): void {
    this.colorTheme = this.settingService.getColorTheme();
    this.settingService.colorTheme$.subscribe(
      (color) => (this.colorTheme = color)
    );
  }

  filterRecipes(filter: string) {
    this.filterData.emit(filter);
  }
}
