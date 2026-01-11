import { App, Aspects, Tags } from "aws-cdk-lib/core";
import { AwsSolutionsChecks } from "cdk-nag";
import { GithubStack } from "./github-stack";

const app = new App();

const user = app.node.getContext("user");
const repo = app.node.getContext("repo");

new GithubStack(app, "GithubStack", { user, repo });

Tags.of(app).add("x:project", "my-project");
Tags.of(app).add("x:team", "my-team");

Aspects.of(app).add(new AwsSolutionsChecks());

app.synth();
