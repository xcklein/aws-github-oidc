import { type App, Stack, type StackProps } from "aws-cdk-lib/core";
import { NagSuppressions } from "cdk-nag";
import { GithubOidc } from "./github-oidc";

export interface GithubStackProps extends StackProps {
  user: string;
  repo: string;
}

export class GithubStack extends Stack {
  readonly oidc: GithubOidc;

  constructor(scope: App, id: string, props: GithubStackProps) {
    super(scope, id, props);

    this.oidc = new GithubOidc(this, "GithubOidc", {
      user: props.user,
      repo: props.repo,
      roleName: "github-oidc-role",
    });

    NagSuppressions.addResourceSuppressions(
      this.oidc.role,
      [
        {
          id: "AwsSolutions-IAM5",
          reason: "Wildcard is required to appropriately create resources.",
        },
      ],
      true,
    );
  }
}
