/** @type {import('next').NextConfig} */
const sourceRef =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  "local"
const buildId = `${sourceRef}-${Date.now()}`

const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
}

export default nextConfig
