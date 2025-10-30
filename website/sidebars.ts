import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'project/introduction',
    'project/setup',
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'guides/projects',
        {
          type: 'category',
          label: 'Tests',
          items: ['guides/tests/tests', 'guides/tests/bulk-addition'],
        },
        {
          type: 'category',
          label: 'Runs',
          items: ['guides/runs/runs', 'guides/runs/run-detail'],
        },
        {
          type: 'category',
          label: 'Users',
          items: ['guides/user-settings', 'project/rbac'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer Docs',
      items: [
        {
          type: 'category',
          label: 'Application',
          items: ['tech/architecture', 'tech/database'],
        },
        {
          type: 'category',
          label: 'API Documentation',
          items: [
            'guides/api',
            'guides/api/authentication',
            'guides/api/examples',
            'guides/api/openapi',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
