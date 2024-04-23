import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/heroes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel  - Comics' },
  ];

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  public currentHero!: Hero;

  get currentHeroForm(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroService.getHeroById(id)))
      .subscribe((hero) => {
        console.log(hero);
        if (!hero?.heroe) return this.router.navigateByUrl('/');
        this.currentHero = hero.heroe;
        this.heroForm.reset(hero.heroe);
        return;
      });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero._id) {
      console.log('aca');
      this.heroService
        .updateHero(this.currentHeroForm, this.currentHero._id)
        .subscribe((hero) => {
          this.router.navigate(['/']);
          this.showSnackbar(`${hero.heroe.superhero} updated!`);
        });
      return;
    }
    this.heroService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigate(['/']);
      this.showSnackbar(`${hero.heroe.superhero} created!`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero._id) throw Error('Hero id is required');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => this.heroService.deleteHeroById(this.currentHero._id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => this.router.navigate(['/heroes']));
  }
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
