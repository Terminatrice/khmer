# ចេះ · application d'entraînement au khmer

Application web statique, sans dépendance ni backend. Toute la progression est
stockée dans le `localStorage` du navigateur.

## Construire

```
python3 ../tools/build.py
```

Le script valide `../vocab/mots.json` et `../vocab/blocs.json`, puis les injecte
dans `index.html`. **Il refuse de builder en cas d'incohérence** : sur une langue
que l'utilisatrice ne lit pas encore, une donnée fausse qui passe est une erreur
qu'elle mémorisera sans pouvoir la voir.

Règles vérifiées, entre autres :

- une graphie doit être en écriture khmère, sans lettres latines ;
- un mot au statut `verifie` doit porter une romanisation ET une source ;
- un mot au statut `non_verifie` ne doit PAS porter de romanisation, sous peine
  d'avoir été inventée ;
- un QCM doit avoir au moins trois options, un choix binaire se jouant à pile ou face.

## Parcours d'apprentissage

Trois temps, et l'ordre est le point important : **on n'interroge jamais sur ce qui n'a pas d'abord été montré.**

1. **La leçon du bloc** : règle, gabarit et liste des mots. Aucun exercice ne se déclenche tant qu'elle n'est pas lue.
2. **La découverte** : chaque mot neuf est présenté tout ouvert, sans notation. Quota de `NOUVEAUX_PAR_JOUR` (4), calé sur un budget de 5 à 8 minutes.
3. **La révision** : seuls les mots déjà découverts passent en interrogation, à intervalles croissants (1, 3, 7, 16, 35, 60 jours).

## Prononciation

Deux lignes distinctes par mot. `rom` est la translittération de la source, `ipa` la prononciation en alphabet phonétique. L'onglet **Sons** donne la clé des symboles, en approximations françaises assumées comme telles.

## Statuts

| Statut | Sens |
|---|---|
| `verifie` | graphie, sens et romanisation confirmés en source, avec URL |
| `a_valider` | non confirmé en dictionnaire, ou romanisation introuvable. À faire valider par un locuteur natif avant apprentissage. |
| `non_verifie` | réservé aux entrées non contrôlées |

## Tester en local

```
python3 -m http.server 8777
```
