# HANDOFF

## 2026-11-26 — старт AI_Persona

**Status:** in-progress

**Done:**

- Ветка `dev`, канон персонажа `persona/persona.json` + схема `persona/persona.schema.json`, `CLAUDE.md`.

**Gaps / pending (ждут владельца):**

- Язык пайплайна: TypeScript (рекомендация) или C#. На машине нет `dotnet`, есть `node` + `pnpm`.
- Генерация картинок: локально (ComfyUI + Flux, бесплатно) или платный API (fal.ai / Replicate).
- Режим работы: соло в этой сессии или «смена с очередью»; для смены нужен GitHub-remote (сейчас его нет).
- Поля канона `null`: имя, волосы, глаза, стиль, язык, тон; пустые `platforms`, `pillars`, `products`.

**Next steps:**

- После ответов: каркас проекта на выбранном языке, команда `validate` для канона, сборщик промпта из канона.
