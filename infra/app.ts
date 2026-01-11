import { App, Aspects } from "aws-cdk-lib/core";
import { AwsSolutionsChecks } from "cdk-nag";
import { GithubStack } from "./github-stack";

const app = new App();

const user = app.node.getContext("user");
const repo = app.node.getContext("repo");

new GithubStack(app, "GithubStack", { user, repo });

Aspects.of(app).add(new AwsSolutionsChecks());

app.synth();
