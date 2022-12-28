# photo-order-react v2.0

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Zasady pracy z repozytorium

Głównym branchem jest `main` - trigeruje github actions i aktualna wersja aplikacji trafia na środowisko `staging`.

Zadania wykonujemy na branchu oddzielonym od `main` i na koniec mergujemy do `main` za pomocą pull requesta.

Release do wersji produkcyjnej następuje przez zmergowanie `main` do brancha `release`. Tylko w tym kierunku, nic nie trafia bezpośrednio na `release`. Osobny github actions publikuje produkcję.

## Uruchomienie środowiska staging

Startujemy aplikację z parametrami `.env.staging`

Musimy zaakceptować brak certyfikatów dla środowiska staging (legacy apka).
Otwieramy `https://staging.oistigmes.com/` - po zaakceptowaniu można zamknąć.

W uruchomionej aplikacji przechodzimy na adres `localhost:3000/photographer/2320`


## Links

photo-order PRD `https://oistigmes-react-ordering.azurewebsites.net`

photo-order STG `https://oistigmes-staging-web-ordering.azurewebsites.net`

oistigmes PRD `https://oistigmes.com/`

oistigmes STG `https://staging.oistigmes.com`

## Other
To learn React, check out the [React documentation](https://reactjs.org/).

