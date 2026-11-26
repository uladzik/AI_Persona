# HANDOFF

## 2026-11-26 — старт AI_Persona

**Status:** in-progress

**Done:**

- Ветка `dev`, канон персонажа `persona/persona.json` + схема `persona/persona.schema.json`, `CLAUDE.md`.
- GitHub `uladzik/AI_Persona` (публичный), `dev` запушен, `main` из GitHub влит merge-коммитом.
- Коммиты: `.githooks/commit-msg` + `.no-auto-commit`; отчёт: `.github/workflows/daily-report.yml` → ветка `reports`.
- PR #1 `dev` → `main` смёржен (`38920fc`); ручной прогон отчёта успешен, `reports/2026-11-26.md` в ветке `reports`.
- Язык канала: английский (`voice.language = en`); язык кода по умолчанию TypeScript.
- Картинки: fal.ai (выбор владельца), бюджет теста $3 одобрен. Ключ `FAL_KEY` в `.env` (gitignored), источник `~/Desktop/_env.keys`.
- Пайплайн на TS: `pnpm faces [N]` (FLUX.2 pro, $0.03/кадр), `pnpm scenes <face.jpg>` (Seedream 4.5 $0.04 + Nano Banana 2 $0.08, 5 сцен = $0.60).
- Цены сверены через официальный API `api.fal.ai/v1/models/pricing`. Расходы: `output/costs.jsonl`, лимит `BUDGET_USD=3`.
- 8 лиц готовы: `output/faces-2026-11-26/` + `contact-sheet.jpg` (верхний ряд 1–4, нижний 5–8). Потрачено $0.27.
- В истории `dev` остались 8 коммитов `chore(auto)` до введения правил: rewrite отклонён, оставлены как есть.

**Gaps / pending (ждут владельца):**

- Номер лица 1–8 → затем `pnpm scenes output/faces-2026-11-26/face-seed<N>.jpg`.
- Является ли `~/Desktop/Gemini_Generated_Image_3a6n3g3a6n3g3a6n.jpeg` (чёрное каре, веснушки, techwear) образцом внешности.
- Видимость репо (сейчас публичный).
- Поля канона `null`: имя, волосы, глаза, стиль, язык, тон; пустые `platforms`, `pillars`, `products`.

**Next steps:**

- Сцены на двух моделях → сравнить удержание лица → выбрать модель (или LoRA ~$2, если обе плохо держат лицо).
- Затем: подписи через `claude -p`, метки disclosure, очередь публикации.
