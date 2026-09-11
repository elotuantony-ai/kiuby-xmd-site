---
name: Legacy bot source
description: Constraint around the uploaded WhatsApp bot package and its obfuscated entrypoint.
---

The uploaded WhatsApp bot entrypoint is heavily obfuscated. Treat it as a preserved runtime/reference asset and avoid rewriting or executing it blindly; pair it with a separately verified service boundary when deeper bot integration is needed.

**Why:** Static inspection cannot reliably establish its commands, side effects, or safety, and the file may perform network or process operations at runtime.

**How to apply:** Keep the public Kiuby XMD site decoupled from the legacy entrypoint until a safe integration contract or readable source is available.