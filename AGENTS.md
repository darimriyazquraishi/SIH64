# AICTE SIH 2026 Portal - Development & Quality Rules

## 1. Quality Standards: Impeccable Anti-Slop Audit
Before finishing any prompt or presenting results, execute the Impeccable detector against all live routes:
```powershell
& "f:\SIH64\.agents\skills\impeccable\scripts\impeccable.cmd" detect http://localhost:5173 http://localhost:5173/complaints http://localhost:5173/overlaps http://localhost:5173/institutions http://localhost:5173/reports http://localhost:5173/admin http://localhost:5173/login
```
All routes must pass with 0 anti-patterns and 0 warnings.

### Key Visual Rules:
- **Contrast**: WCAG AA ≥ 4.5:1. Dark muted text must use `#989898` (not `#858585`), placeholder text `#aaaaaa` (not `#858585`), alert pill `#c72e2e` (not `#f14c4c`).
- **No Nested Cards**: Do not put bordered cards inside cards. Use clean divider lines (`divide-y divide-[#2d2d2d]`) or section headers.
- **Text Sizing**: No `text-[10px]` or smaller. Minimum UI text is `text-xs`.
- **Text Wrapping**: Use `[text-wrap:pretty]` on prose/descriptions and `[text-wrap:balance]` on headlines.
- **Padding**: Use standard Tailwind spacing (`p-4`, `p-5`, `p-6`). Do not use fractional arbitrary padding like `p-4.5`.

## 2. Authentication Policy
- Login is **optional / not forced**. Users must be able to directly navigate to `/`, `/complaints`, `/overlaps`, `/institutions`, `/reports`, `/admin` without being redirected to `/login`.
- Dev bypass tokens and default admin user fallback ensure all live queries work seamlessly.

## 3. Humanized Copywriting
- Do not use AI jargon, inflated claims, staged triads, or promotional filler.
- Tone is professional, clear, and direct public sector operations.
