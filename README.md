# COBU - Command Builder

A customizable command line utility that lets you build command line utilities - from the command line!

## Installation

```sh
> npm install -g cobu
```

## Examples

Output general help text to console

```
> cobu
```

### Open the web sites you need for work with a single command

```sh
=== Configuration ===

# By using the --add option, we can add the web sites one at a time. If '--add' is not used, the actions
# that are declared will replace any existing actions on the same application or flag.
> cobu config workweb --add 'https://outlook.office.com/mail'
> cobu config workweb --add 'https://outlook.office.com/calendar'
> cobu config workweb --add 'https://myapplications.microsoft.com'
> cobu config workweb --add 'https://github.com/userid?tab=repositories'
> cobu config workweb --add 'https://dev.azure.com/MyOrg/MyProject'

=== Usage ===
> cobu workweb #Opens the above web pages in your default browser
```

### Open up Wikipedia in any configured language

Let's use cobu to open up Wikipedia in your default browser, and configure a few languages to use

```sh
=== Configuration ===

# NOTE! For usage on Linux, enclose any arguments that contain variable references (e.g. '${query}')
# in single quotes to avoid the shell trying to replace them with variable values upon input
#
# Create the application named 'wikipedia' and assign it an action to open a URL, just by
# referencing the URL. Note that the language has a default value 'en'.
> cobu config wikipedia 'https://${language:en}.wikipedia.org/w/index.php?search=${query}'

# Configure French and Swedish as other possible target languages
> cobu config wikipedia fr '$language=fr'
> cobu config wikipedia sv '$language=sv'

# Instruct the application to pickup the ${query} variable from the next available argument
> cobu config wikipedia '${query}'

=== Usage ===
> cobu wikipedia 'Nikola Tesla'     # Opens Wikipedia in English, since it's the default
> cobu wikipedia sv 'Nikola Tesla'  # Opens up the Swedish Wikipedia page on Nikola Tesla
```

### Open your favorite projects in VS Code

Let's use cobu to open any application that can be found in the path, in this case Visual Studio Code...

```sh
=== Configuration ===

# Create an application named 'vscode' and assign an action to open app 'code' with a folder argument
# You indicate that you want to open an app by assigning an action in format: '> appname ${argumentVariable}'
> cobu config vscode '> code ${folder}'

# And then add some projects
> cobu config vscode hello-world '$folder=C:\Users\me\Documents\projects\hello-world'
> cobu config vscode todo-list '$folder=C:\Users\me\Documents\projects\todo-list'

=== Usage ===
> cobu vscode hello-world    # Opens a new VS Code instance with your Hello World project loaded
> cobu vscode todo-list      # You'll figure out what this does...
```
