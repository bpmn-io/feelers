> **Warning**  
> This package is in early phases of development and is not yet considered stable. Community contributions are very welcome, as always ;)


# feelers

![image](https://user-images.githubusercontent.com/17801113/222329383-c3e63077-e288-41e0-832d-7e71e331d76a.png)

A templating solution built on top of [DMN](https://www.omg.org/spec/DMN/) FEEL. 
Like moustache / handlebars but with FEEL.

**Package includes:**
- A [lezer](https://lezer.codemirror.net/) grammar and consequently parser for the templating language
- A parseMixed language definition which brings markdown, lezer and FEEL parsing all into one
- An editor for feelers, build from [codemirror](https://codemirror.net/)
- An interpreter to fill your templates with data, powered by [feelin](https://github.com/nikku/feelin)
- A simple playground to showcase the language 

## Usage 
...

## Feelers templating language features
...

## Build and run

Build the project in a Posix environment. On Windows, that is [Git Bash](https://gitforwindows.org/) or WSL. 

Note we currently support development environments with Node.js version 16 (and npm version 8). We encourage you to use a Node.js version manager (e.g., [`nvm`](https://github.com/nvm-sh/nvm) or [`n`](https://github.com/tj/n)) to set up the needed versions.

Prepare the project by installing all dependencies:

```sh
npm install
```

Then, depending on your use-case you may run any of the following commands:

```sh
# run all tests
npm run test

# runs single-start test case for development
npm start
npm run start

# generate the lezer parser from its grammar definition
npm run generate:parser

# build all dependencies locally and spool up playground
npm run start:playground

# build all dependencies locally and build playground
npm run build:playground
```

## Related

* [lezer-feel](https://github.com/nikku/lezer-feel) - FEEL language definition for the [Lezer](https://lezer.codemirror.net/) parser system
* [feel-playground](https://github.com/nikku/feel-playground) - Interactive playground to learn the FEEL language
* ...

## License

MIT
