Portfolio for designer and illustrator, Jennifer Heintz.

Built with [biggie](https://github.com/baptistebriel/biggie), a JavaScript application boilerplate written in ES6 based on [bigwheel](https://github.com/bigwheel-framework), a minimalist framework from [Jam3](http://www.jam3.com/).

### Getting Started

```sh
# clone repo to local
git clone https://github.com/mikehwagz/jennifer-heintz.git

# move into directory
cd jennifer-heintz

# install dependencies
yarn

# start gulp
gulp
```

### Development

Assuming the project is on your desktop, open a new terminal window and...

```sh
# move into the project directory
cd Desktop/jennifer-heintz

# start gulp
gulp
```

#### Directory Structure
Listed below is the basic structure of the files for this site.

```sh
├── assets
│   ├── fonts
│   ├── js
│   ├── less
│   └── media # manage images and videos in here
├── build # built js and css files end up here
├── data
│   └── data.json # manage content here
├── index.html
├── templates
```

### Introduction to JSON

- Stands for JavaScript Object Notation
- It's one big object

#### Objects

- Notated by curly braces `{}`
- It's a comma-separated list of key-value pairs

```
{
  "key" : "value",
  "another_key" : "another_value"
}
```

#### Arrays

- Notated by square braces `[]`
- It's a comma-separated list of values
- In arrays, the order of the values matters

Example: `["jenny", "mike", "royal", "dim-sum"]`

> :exclamation: Beware of trailing commas! This is when you have an extra comma after the last value in an object or array. Atom should highlight text after any trailing commas in red, which is helpful.

#### Values

In the object and array examples above, the values strings, or some text in double quotes. Values can also be numbers, booleans (true or false), objects, or arrays. In your JSON CMS, we often nest objects and arrays inside one another, so this is important to understand.

----

### Adding Content

Below is the top-level structure of your JSON CMS. It essentially follows the structure of your site.

```JSON
{
  "projects" : {},
  "work" : {},
  "home" : {},
  "about" : {},
  "contact" : {}
}
```

### `projects`

An object where each key corresponds to a project slug.

The value of each project key is an object containing all of the project's data:

`title` - string
- The title of the project as a string

`slug` - string
- The slug for the project. This must match the key for the project defined before.

`lede` - string
- Text that will appear on each project tile on the work page.

`thumbnail` - string
- The path to an image for the project tile on the work page. Make sure it's the right dimensions!

`border_color` - string
- A hex code for the color of the border for that project


`gradient` - object
- An object defining the colors of the gradient for each project. Keys are `"from"` and `"to"` and the values of each are the hex codes.

`content` - array of objects
- Contains information about each block or slide of the project's case study. More on that below.

### Case Study Blocks
As mentioned briefly above, each project has `content` which is an array of objects. Each object inside content represents one block or slide in the case study. Each block object will contain exactly one key-value pair. The key is the name of the block type, and the value is an object with the data required for that block type.

Here's an example block within a project's `content` object:

```JSON
"content" : [
  {
    "example_block" : {
      "some_key" : "some_value"
    }
  },
  {
    "another_example_block" : {
      "some_key" : "some_value"
    }
  }
]
```

The order of the block objects determines the order of the slides in the case study. Here is an overview of each block type available:

### `text`
- 3 key-value pairs:
  - `bg_color` - string, hex code
  - `text` - string, text content
  - `text_color` - string, hex code
  - `align` - string, css text-align values (center, left, or right)

### `image`
- 2 key-value pairs:
  - `bg_color` - string, hex code
  - `src` - string, path to the image file

### `split`
- 2 key-value pairs:
  - `left` and `right` - both objects containing either text block info or image block info

### `video`
- 1 key-value pair:
  - `src` - string, path to the mp4 video file
