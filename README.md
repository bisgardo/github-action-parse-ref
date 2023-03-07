# `bisgardo/github-action-parse-ref`

GitHub action for parsing a Git ref into its type and name.

*Inputs*

- `ref` (required): The ref in the format of a full ref `refs/<type>/<name>` or a shorthand without `refs/<type>`.
- `default-ref-type` (default: `tags`): The type to use if `ref` is a shorthand refname.

*Outputs*

- `ref-type`: The type of the ref (`heads` for branches, `tags` for tags, etc.).
- `ref-name`: The name of the branch, tag, etc. as defined by `ref-type`.
- `ref`: The fully resolved valid ref. Empty if ref is invalid.

The action doesn't fail if the input ref is invalid.
For example, the parsing will succeed if the ref is ending with a `/` which is invalid.
The `ref` output can be used to detect invalid refs as it is always valid or empty.

## Example

The following workflow snippet defines a single job `my_job` which applies the default ref type `heads` to
the shorthand ref `my_branch` and outputs the ref type, name, and full ref.

A subsequent step prints all the output values to illustrate how the extracted group matches are accessed.

```yaml
jobs:
  my_job:
    runs-on: ubuntu-latest
    steps:
    - uses: bisgardo/github-action-parse-ref@v1
      id: my_step
      with:
        ref: 'my_branch'
        default-ref-type: 'heads'
    - run: |
        echo "type: '${{steps.my_step.outputs.ref-type}}'"
        echo "name: '${{steps.my_step.outputs.ref-name}}'"
        echo "full ref: '${{steps.my_step.outputs.ref}}'"
```
