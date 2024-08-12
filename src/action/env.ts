const github = () => !!process.env.GITHUB_ACTION

const mock = () => process.env.GITHUB_ACTION === 'jest-mock'

export const env = { github, mock }