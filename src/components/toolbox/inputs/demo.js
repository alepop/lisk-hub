import React from 'react';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';
import { Input, AutoresizeTextarea } from '.';

/* eslint-disable-next-line no-console */
const onChange = console.log;

const InputsDemo = () => (
  <div>
    <h2>Input</h2>
    <DemoRenderer>
      <Input
        onChange={onChange}
        placeholder="Input demo placeholder (default: size L)"
        label="Input Label"
      />
      <Input
        size="m"
        onChange={onChange}
        placeholder="Input demo placeholder (size M)"
        label="Input Label"
      />
      <Input
        size="s"
        onChange={onChange}
        placeholder="Input demo placeholder (size S)"
        label="Input Label"
      />
      <Input
        size="xs"
        onChange={onChange}
        placeholder="Input demo placeholder (size XS)"
        label="Input Label"
      />
    </DemoRenderer>
    <DemoRenderer>
      <Input
        onChange={onChange}
        name="demo"
        value="ok value"
        status="ok"
        feedback="Some hint for what the value should be"
      />
      <Input
        onChange={onChange}
        name="demo"
        value="validating..."
        status="pending"
      />
      <Input
        onChange={onChange}
        name="demo"
        value="0alkawja;jk"
        status="error"
        feedback="Something wrong was typed."
      />
    </DemoRenderer>
    <DemoRenderer>
      <DarkWrapper display="block">
        <Input
          onChange={onChange}
          name="demo"
          value="ok value"
          status="ok"
          dark
        />
        <Input
          onChange={onChange}
          name="demo"
          value="validating..."
          status="pending"
          dark
        />
        <Input
          onChange={onChange}
          name="demo"
          value="0alkawja;jk"
          status="error"
          feedback="Something wrong was typed."
          dark
        />
      </DarkWrapper>
    </DemoRenderer>
    <DemoRenderer>
      <Input
        onChange={onChange}
        name="search-demo"
        placeholder="Type something to search..."
        icon="searchInput"
        size="m"
      />
    </DemoRenderer>
    <DemoRenderer>
      <AutoresizeTextarea
        name="shareLink"
        value="text in the text area"
        className="whatever"
        readOnly
      />
    </DemoRenderer>
  </div>
);

export default InputsDemo;
