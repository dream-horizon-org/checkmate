# Checkmate Documentation (Docusaurus)

This directory contains the Docusaurus-based documentation for Checkmate, migrated from Astro Starlight.

## 🚀 Quick Start

### Development

```bash
cd website
yarn install
yarn start
```

The documentation site will be available at `http://localhost:3000`

### Build

```bash
yarn build
```

This generates static content into the `build` directory that can be served using any static hosting service.

### Serve Build Locally

```bash
yarn serve
```

## 📁 Project Structure

```
website/
├── docs/                  # Markdown/MDX documentation files
│   ├── project/          # Introduction, setup, RBAC
│   ├── guides/           # User guides (projects, tests, runs, API)
│   └── tech/             # Technical docs (architecture, database)
├── src/
│   ├── components/       # Custom React components (Card, Steps)
│   ├── css/             # Custom CSS
│   └── pages/           # Custom pages (homepage)
├── static/              # Static assets (images, OpenAPI spec)
│   ├── assets/          # GIFs and images
│   └── openapi.yaml     # OpenAPI 3.0 specification
├── docusaurus.config.ts # Docusaurus configuration
└── sidebars.ts          # Sidebar navigation structure
```

## 🔧 Configuration

### Docusaurus Config (`docusaurus.config.ts`)

- **URL**: `https://checkmate.dreamhorizon.org`
- **Base URL**: `/`
- **Organization**: `dream-horizon-org`
- **Project**: `checkmate`

### Features

- **Docs as Homepage**: Documentation is served at the root path (`routeBasePath: '/'`)
- **OpenAPI Integration**: Interactive API reference at `/api-reference/` powered by Redocusaurus
- **Dark Mode**: Respects system preferences
- **Custom Components**: Card, CardGrid, Steps for enhanced documentation UX

## 📝 Writing Docs

### MDX Components

#### Admonitions

```mdx
:::tip Title
Your tip content here
:::

:::caution Warning
Your caution content here
:::

:::note
Your note content here
:::
```

#### Tabs

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="option1" label="Option 1">
    Content for option 1
  </TabItem>
  <TabItem value="option2" label="Option 2">
    Content for option 2
  </TabItem>
</Tabs>
```

#### Cards

```mdx
import { Card, CardGrid } from '@site/src/components/Card';

<CardGrid>
  <Card title="Feature 1">
    Description of feature 1
  </Card>
  <Card title="Feature 2">
    Description of feature 2
  </Card>
</CardGrid>
```

#### Steps

```mdx
import { Steps } from '@site/src/components/Steps';

<Steps>

1. **First Step**
   Details about the first step

2. **Second Step**
   Details about the second step

3. **Third Step**
   Details about the third step

</Steps>
```

### Images

Place images in `static/assets/` and reference them:

```mdx
![Alt text](/assets/image-name.gif)
```

## 🌐 Deployment

The site is configured for deployment to GitHub Pages or any static hosting service.

### GitHub Pages

```bash
yarn deploy
```

### Vercel/Netlify

Connect your repository and set:
- **Build Command**: `cd website && yarn build`
- **Output Directory**: `website/build`

## 📚 Migration from Astro

This documentation was migrated from Astro Starlight with the following conversions:

| Astro Starlight | Docusaurus |
|-----------------|------------|
| `<Aside>` | `:::tip/caution/note` |
| `<Tabs>` with `label` | `<Tabs>` with `value` |
| `<Card>` from Starlight | Custom `<Card>` component |
| `<Steps>` from Starlight | Custom `<Steps>` component |
| `LinkCard` | Regular markdown links |

## 🔗 Links

- [Checkmate Repository](https://github.com/dream-horizon-org/checkmate)
- [Docusaurus Documentation](https://docusaurus.io)
- [Discord Community](https://discord.gg/wBQXeYAKNc)

## ⚠️ Known Issues

- Some internal links may need adjustment (currently set to `warn` instead of `throw`)
- OpenAPI spec requires manual copy from parent directory during build (handled in prebuild script)

## 📄 License

MIT License - see main project LICENSE file
