const inquirer = require(`inquirer`);
const fs = require(`fs`);
const rimraf = require(`rimraf`);
const { ncp } = require(`ncp`);
const { install, uninstall } = require(`spawn-npm-install`);

const {
    kickstart,
    shared,
    standard,
    react,
} = require(`./package.json`);

// prompt the user for some answers, then work with those answers
inquirer
    .prompt([
        {
            type: `input`,
            name: `projectName`,
            message: `What's the name of your project?`,
            default: `awesome-project`,
        },
        {
            type: `input`,
            name: `projectAuthor`,
            message: `Who's the author?`,
            default: `John Doe <john@doe.com>`,
        },
        {
            type: `confirm`,
            name: `useReact`,
            message: `Do you want to use React?`,
            default: true,
        },
    ])

    .then((answers) => {
        const { projectName, projectAuthor, useReact } = answers;

        // eslint-disable-next-line promise/no-nesting
        return new Promise((resolve) => resolve())
            .then(() => {
                // install the required dependencies and devDependencies
                console.log(`✅ Installing required dependencies`);
                return installDeps(shared);
            })
            .then(() => {
                // install the optional dependencies and devDependencies, depending on if react support was selected
                console.log(`✅ Installing optional dependencies`);
                if (useReact) {
                    return installDeps(react);
                }
                return installDeps(standard);
            })
            .then(() => {
                // copy the template files to the root, and then delete the originals
                console.log(`🖨️ Creating template files`);
                return new Promise((resolve) => {
                    ncp(`./.templates/standard`, `./`, () => {
                        if (useReact) {
                            ncp(`./.templates/react`, `./`, () => {
                                rimraf(`./.templates`, () => {
                                    resolve();
                                });
                            });
                        } else {
                            rimraf(`./.templates`, () => {
                                resolve();
                            });
                        }
                    });
                });
            })
            .then(() => {
                // uninstall the dependencies needed for this script
                console.log(`🗑️ Removing unused dependencies`);
                return uninstallDeps(kickstart);
            })
            .then(() =>
                // read in the package.json, remove the unecessary objects, update some fields, and resave it
                fs.readFile(`./package.json`, (err, data) => {
                    if (err) throw err;

                    const packageJSON = JSON.parse(data);

                    console.log(`🗑️ Cleaning up package.json`);
                    delete packageJSON.shared;
                    delete packageJSON.react;
                    delete packageJSON.standard;
                    delete packageJSON.kickstart;
                    delete packageJSON.scripts.kickstart;
                    fs.unlink(`./kickstart.js`, (error) => {
                        if (error) throw error;
                    });

                    console.log(`✍️ Updating package.json`);
                    packageJSON.name = projectName;
                    packageJSON.author = projectAuthor;
                    packageJSON.scripts.start = `concurrently "parcel src/www/index.pug" "nodemon src/app/index.js --watch src/app --watch src/common"`;

                    console.log(`💾 Saving package.json`);
                    fs.writeFile(
                        `./package.json`,
                        JSON.stringify(packageJSON, null, 4),
                        (error) => {
                            if (error) throw error;
                        }
                    );
                })
            )
            .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));

function installDeps(deps) {
    return new Promise((resolve) => {
        // install the regular dependencies, then the devDependencies, then resolve
        install(
            deps.dependencies,
            {
                stdio: `inherit`,
            },
            () =>
                install(
                    deps.devDependencies,
                    {
                        stdio: `inherit`,
                        saveDev: true,
                    },
                    () => resolve()
                )
        );
    });
}

function uninstallDeps(deps) {
    return new Promise((resolve) => {
        // uninstall the regular dependencies, then the devDependencies, then resolve
        uninstall(
            deps.dependencies,
            {
                stdio: `inherit`,
            },
            () =>
                uninstall(
                    deps.devDependencies,
                    {
                        stdio: `inherit`,
                        saveDev: true,
                    },
                    () => resolve()
                )
        );
    });
}
