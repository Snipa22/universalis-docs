import { Title, Text, Container, Space, Input, Group, SimpleGrid, List, Box } from '@mantine/core';
import { ChevronDownIcon } from '@modulz/radix-icons';
import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { SwaggerSchema } from '../../data/swagger/types';
import { RestComponent } from '../RestComponent/RestComponent';
import { RestWelcome } from '../RestWelcome/RestWelcome';
import { RestEndpoint } from '../RestEndpoint/RestEndpoint';
import useStyles from './RestDocumentation.styles';
import { LoadingDocumentation } from '../LoadingDocumentation/LoadingDocumentation';

function tagToId(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function RestDocumentation() {
  const { classes } = useStyles();

  const [schemaVersion, setSchemaVersion] = useState<string>('v1');

  const [schema, setSchema] = useState<SwaggerSchema>();
  useEffect(() => {
    setSchema(undefined);
    fetch(`/api/schema/${schemaVersion}`)
      .then((res) => res.json())
      .then(setSchema);
  }, [schemaVersion]);

  if (schema == null) {
    return <LoadingDocumentation />;
  }

  const simpleSchema = Object.keys(schema.paths).flatMap((path) =>
    Object.keys(schema.paths[path]).map((method) => ({
      path,
      method,
      endpoint: schema.paths[path][method],
    }))
  );

  const endpointHeaders = simpleSchema.map(({ endpoint }) => endpoint.tags[0]);
  const endpointIds = endpointHeaders.map(tagToId);

  const toc = (
    <Box
      sx={(theme) => ({
        width: 400,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        padding: 4,
      })}
    >
      <Text size="lg">Table of contents</Text>
      <List type="ordered">
        {endpointHeaders.map((h, i) => (
          <List.Item>
            <Link href={`#${endpointIds[i]}`}>{h}</Link>
          </List.Item>
        ))}
      </List>
    </Box>
  );

  return (
    <Container>
      <SimpleGrid cols={2}>
        <Title id="rest-api">{schema.info.title} REST API</Title>
        <Group position="right">
          <Text size="lg">Version</Text>
          <Input
            component="select"
            rightSection={<ChevronDownIcon />}
            sx={{ width: 200 }}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSchemaVersion(e.target.value)}
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
          </Input>
        </Group>
      </SimpleGrid>
      <RestWelcome />
      <Space h="md" />
      {toc}
      <Space h="xl" />
      {simpleSchema.map(({ path, method, endpoint }) => (
        <div key={path + method}>
          <RestEndpoint path={path} method={method} endpoint={endpoint} />
        </div>
      ))}
      <Space h="xl" />
      <Title id="rest-api-schemas" className={classes.schemasHeader}>
        Schemas
      </Title>
      {Object.keys(schema.components.schemas)
        .map((name) => ({ name, component: schema.components.schemas[name] }))
        .map(({ name, component }) => (
          <div key={name}>
            <RestComponent name={name} component={component} />
          </div>
        ))}
    </Container>
  );
}
