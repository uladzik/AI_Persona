# AI_Persona

Мини-пайплайн для AI-персонажа (спортивная девушка с веснушками) под канал, через который продвигаются
продукты владельца.

## Канон

- `persona/persona.json` — единственный источник правды о персонаже, проверяется `persona/persona.schema.json`.
- Промпты картинок и подписи собираются только из канона; вручную в промптах внешность не описывать.
- Возраст персонажа всегда взрослый (схема: `age >= 21`).
- Каждый пост несёт `disclosure.ai_label`; рекламный пост ещё и `disclosure.ad_label`.
- `products` — только реальные продукты владельца, не выдумывать.

## Этапы пайплайна (план)

1. Канон → reference sheet лица (набор кадров одного лица).
2. Закрепление лица: LoRA или face-reference (IP-Adapter / PuLID) — выбор открыт.
3. Контент-план → промпт кадра → картинка.
4. Подпись через LLM (локально `claude -p`, не платный API) + метки disclosure.
5. Очередь на публикацию; публикация только после ручного OK.

## Коммиты

Автокоммит отключён (`.no-auto-commit`): коммит = один логический блок, сообщение пишется руками.
Хук `.githooks/commit-msg` (включается `git config core.hooksPath .githooks`) отклоняет всё остальное.

```text
<type>(<scope>): <что изменилось, ≤72 символа>

- что сделано, по пункту на действие
- зачем, если неочевидно

Co-Authored-By: ...
```

- `type`: `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`. Тип и scope на английском, текст на русском.
- `scope`: часть проекта (`persona`, `pipeline`, `git`, `report`).
- Ветки: работа в `dev` / `feature/<name>`, в `main` только через PR с OK владельца.

## Ежедневный отчёт

`.github/workflows/daily-report.yml` в 23:30 по Берлину собирает коммиты дня со всех веток
(`scripts/daily-report.sh`) и кладёт `reports/YYYY-MM-DD.md` в ветку `reports`. Пустой день отчёта не даёт.
Локально: `scripts/daily-report.sh 2026-11-26`.

## Открытые решения

См. `HANDOFF.md`.

## Проверка канона

```bash
python3 -c "import json,jsonschema;jsonschema.validate(json.load(open('persona/persona.json')),json.load(open('persona/persona.schema.json')));print('ok')"
```
