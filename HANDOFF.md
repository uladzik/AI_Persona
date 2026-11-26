# HANDOFF

## 2026-11-26 — старт AI_Persona

**Status:** in-progress

**Done:**

- Ветка `dev`, канон персонажа `persona/persona.json` + схема `persona/persona.schema.json`, `CLAUDE.md`.
- GitHub `uladzik/AI_Persona` (публичный), `dev` запушен, `main` из GitHub влит merge-коммитом.
- Коммиты: `.githooks/commit-msg` + `.no-auto-commit`; отчёт: `.github/workflows/daily-report.yml` → ветка `reports`.
- PR #1 `dev` → `main` смёржен (`38920fc`); ручной прогон отчёта успешен, `reports/2026-11-26.md` в ветке `reports`.
- Язык канала: английский (`voice.language = en`); язык кода по умолчанию TypeScript.
- В истории `dev` остались 8 коммитов `chore(auto)` до введения правил: rewrite отклонён, оставлены как есть.

**Gaps / pending (ждут владельца):**

- Язык пайплайна: TypeScript (рекомендация) или C#. На машине нет `dotnet`, есть `node` + `pnpm`.
- Генерация картинок: локально (ComfyUI + Flux, бесплатно) или платный API (fal.ai / Replicate).
- Режим работы: соло в этой сессии или «смена с очередью»; для смены нужен GitHub-remote (сейчас его нет).
- Поля канона `null`: имя, волосы, глаза, стиль, язык, тон; пустые `platforms`, `pillars`, `products`.

**Next steps:**

- После ответов: каркас проекта на выбранном языке, команда `validate` для канона, сборщик промпта из канона.
