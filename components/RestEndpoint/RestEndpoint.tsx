import { Space, Text, Title, Divider, Group, Button, TextInput, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SwaggerEndpoint } from '../../data/swagger/types';
import useStyles from './RestEndpoint.styles';

function tagToId(tag: string) {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

export function RestEndpoint({
  path,
  method,
  endpoint,
}: {
  path: string;
  method: string;
  endpoint: SwaggerEndpoint;
}) {
  const { classes } = useStyles();

  const form = useForm({
    initialValues: {
      test: '',
      test2: '',
    },
  });

  return (
    <div>
      <Space h="lg" />
      <Title className={classes.title} id={tagToId(endpoint.tags[0])}>
        {endpoint.tags[0]}
      </Title>
      <Divider />
      <div>
        <div>
          <span className={classes.method}>{method}</span> -{' '}
          <span className={classes.path}>{path}</span>
        </div>
        <Text>{endpoint.summary}</Text>
        <Container sx={{ maxWidth: 580 }} mt="md">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <TextInput size="md" mt="sm" label="Test" {...form.getInputProps('test')} />
            <Text size="md">Some description</Text>
            <TextInput size="md" mt="sm" label="Test2" {...form.getInputProps('test2')} />
            <Text size="md">Some description</Text>
            <Group position="right" mt="md">
              <Button type="submit">Execute</Button>
            </Group>
          </form>
        </Container>
      </div>
    </div>
  );
}
