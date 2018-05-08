import { defineInlineTest } from 'jscodeshift/dist/testUtils';
import transform from './patternfly-react-to-react-core';

defineInlineTest(
  transform,
  {},
  `import { Button, Alert } from 'patternfly-react'`,
  `import { Button, Alert } from '@patternfly-test/react-core'`,
  'Transforms patternfly-react to @patternfly-test/react-core'
);

defineInlineTest(
  transform,
  {},
  `import { Button, Alert } from '@patternfly-test/react-core'`,
  '',
  'ignores @patternfly-test/react-core imports'
);

defineInlineTest(
  transform,
  {},
  `
  import { somthing } from 'patternfly';
  import { Button, Alert } from 'patternfly-react';
  `,
  `
  import { somthing } from 'patternfly';
  import { Button, Alert } from '@patternfly-test/react-core';
  `,
  'ignores patternfly imports'
);
