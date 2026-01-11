import * as IAM from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib/core";
import { Construct } from "constructs";

export interface GithubOidcProps {
  /**
   * The github repo owner username.
   */
  user: string;
  /**
   * The github repo slug.
   */
  repo: string;
  /**
   * A custom name for the OIDC role.
   * @default - A name is generated
   */
  roleName?: string;
}

export class GithubOidc extends Construct {
  readonly provider: IAM.OpenIdConnectProvider;
  readonly role: IAM.Role;

  constructor(scope: Construct, id: string, props: GithubOidcProps) {
    super(scope, id);

    this.provider = new IAM.OpenIdConnectProvider(this, "Oidc", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    this.role = new IAM.Role(this, "Role", {
      roleName: props.roleName,
      assumedBy: new IAM.WebIdentityPrincipal(
        this.provider.openIdConnectProviderArn,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${props.user}/${props.repo}:*`,
          },
        },
      ),
    });

    this.role.addToPolicy(
      new IAM.PolicyStatement({
        effect: IAM.Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:*:${Stack.of(this).account}:parameter/cdk-bootstrap/*`,
        ],
      }),
    );
    this.role.addToPolicy(
      new IAM.PolicyStatement({
        effect: IAM.Effect.ALLOW,
        actions: ["cloudformation:*"],
        resources: ["*"],
      }),
    );
    this.role.addToPolicy(
      new IAM.PolicyStatement({
        effect: IAM.Effect.ALLOW,
        actions: ["s3:*"],
        resources: ["arn:aws:s3:::cdktoolkit-stagingbucket-*/*"],
      }),
    );
    this.role.addToPolicy(
      new IAM.PolicyStatement({
        effect: IAM.Effect.ALLOW,
        actions: ["sts:AssumeRole"],
        resources: ["arn:aws:iam::*:role/cdk*"],
      }),
    );
  }
}
