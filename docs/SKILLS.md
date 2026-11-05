![Skills](https://glyphbadges.dev/skills?js,ts,react,next,tailwind)

# Skill icons

Glyph can render a horizontal row of skill icons in the same style as the
upstream Skill Icons project:

```md
![Skills](https://glyphbadges.dev/skills?js,ts,react,next,tailwind)
```

The compact query form (`/skills?js,ts,react`) and the named form
(`/skills?i=js,ts,react`) are both supported. Icons use dark variants by
default; add `theme=light` for light variants:

```md
![Skills](https://glyphbadges.dev/skills?i=js,ts,react&theme=light)
```

## Common names

| Name | Icon |
|---|---|
| `js` / `javascript` | JavaScript |
| `ts` / `typescript` | TypeScript |
| `html` | HTML |
| `css` | CSS |
| `react` | React |
| `vue` | Vue |
| `next` / `nextjs` | Next.js |
| `node` / `nodejs` | Node.js |
| `svelte` | Svelte |
| `tailwind` / `tailwindcss` | Tailwind CSS |
| `python` | Python |
| `php` | PHP |
| `go` / `golang` | Go |
| `rust` | Rust |
| `java` | Java |
| `kotlin` | Kotlin |
| `c` | C |
| `cpp` | C++ |
| `csharp` / `cs` | C# |
| `docker` | Docker |
| `git` | Git |
| `github` | GitHub |
| `gitlab` | GitLab |
| `vercel` | Vercel |
| `postgres` / `postgresql` | PostgreSQL |
| `mysql` | MySQL |
| `mongodb` | MongoDB |
| `redis` | Redis |
| `graphql` | GraphQL |
| `firebase` | Firebase |
| `supabase` | Supabase |
| `wordpress` | WordPress |
| `discord` | Discord |

## Complete upstream catalog

The endpoint accepts every SVG currently present in the upstream
[`skillicons/icons`](https://github.com/lakshanjayalath/skillicons/tree/main/icons)
directory. Use the filename without `.svg`, or use the compact aliases above.
Dark/light pairs are selected automatically based on `theme`.

`AWS`, `Ableton`, `ActivityPub`, `Actix`, `Adonis`, `AfterEffects`, `AiScript`,
`AlpineJS`, `AndroidStudio`, `Angular`, `Ansible`, `Apollo`, `Appwrite`,
`Arduino`, `Astro`, `Atom`, `Audition`, `AutoCAD`, `Azul`, `Azure`, `BSD`,
`Babel`, `Bash`, `Bevy`, `Blender`, `Bootstrap`, `C`, `CMake`, `CPP`, `CS`,
`CSS`, `Cassandra`, `Clojure`, `Cloudflare`, `CodePen`, `CoffeeScript`,
`Crystal`, `D3`, `DENO`, `Dart`, `DevTo`, `Discord`, `DiscordBots`, `Django`,
`Docker`, `DotNet`, `DynamoDB`, `Eclipse`, `Electron`, `Elixir`, `Emacs`,
`Ember`, `Emotion`, `ExpressJS`, `FastAPI`, `Fediverse`, `Figma`, `Firebase`,
`Flask`, `Flutter`, `Forth`, `Fortran`, `GCP`, `GTK`, `GameMakerStudio`,
`Gatsby`, `Gherkin`, `Git`, `GitLab`, `Github`, `GithubActions`, `GoLang`,
`Godot`, `Gradle`, `Grafana`, `GraphQL`, `Gulp`, `HTML`, `Haskell`, `Haxe`,
`HaxeFlixel`, `Heroku`, `Hibernate`, `IPFS`, `Idea`, `Illustrator`, `Instagram`,
`JQuery`, `Java`, `Jenkins`, `Jest`, `Julia`, `Kafka`, `Kotlin`, `Ktor`,
`Kubernetes`, `LaTeX`, `Laravel`, `LinkedIn`, `Linux`, `Lit`, `Lua`, `Markdown`,
`Mastodon`, `MaterialUI`, `Matlab`, `Maven`, `Misskey`, `MongoDB`, `MySQL`,
`NeoVim`, `NestJS`, `Netlify`, `NextJS`, `Nginx`, `Nim`, `NodeJS`, `NuxtJS`,
`OCaml`, `Octave`, `OpenShift`, `OpenStack`, `PHP`, `Perl`, `Photoshop`,
`Premiere`, `Prisma`, `Processing`, `Prometheus`, `Pug`, `PyTorch`, `Python`,
`QT`, `R`, `ROS`, `RabbitMQ`, `Rails`, `RaspberryPi`, `React`, `ReactiveX`,
`Redis`, `Redux`, `Regex`, `Remix`, `Replit`, `Rocket`, `RollupJS`, `Ruby`,
`Rust`, `SQLite`, `SVG`, `Sass`, `Scala`, `Selenium`, `Sentry`, `Sequelize`,
`Sketchup`, `SolidJS`, `Solidity`, `Spring`, `StackOverflow`, `StyledComponents`,
`Supabase`, `Svelte`, `Swift`, `Symfony`, `TailwindCSS`, `Tauri`, `TensorFlow`,
`ThreeJS`, `Twitter`, `TypeScript`, `Unity`, `UnrealEngine`, `V`, `VIM`,
`VSCode`, `Vala`, `Vercel`, `VisualStudio`, `Vite`, `VueJS`, `WebAssembly`,
`Webflow`, `Webpack`, `WindiCSS`, `Wordpress`, `Workers`, `XD`, `Zig`.

Glyph retrieves these SVG assets from the upstream repository at request time
and embeds them into the generated image. The upstream repository does not
declare a license in its GitHub metadata; review its terms before redistributing
or mirroring the assets elsewhere.
