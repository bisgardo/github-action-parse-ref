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

An additional job `my_dependent_job` is defined to illustrate how to access the outputs from other jobs
that `needs` the one containing the action.

```yaml
jobs:
  my_job:
    runs-on: ubuntu-latest
    outputs:
      full-ref: "${{steps.my_step.outputs.ref}}"
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
        
  my_dependent_job:
    runs-on: ubuntu-latest
    needs: my_job
    steps:
      - run: |
          echo "full-ref: ${{needs.my_job.outputs.full-ref}}"
```

The parsed ref components are now available in subsequent steps of the job `my_job` as the template variables

* `ref-type`: `${{steps.my_step.outputs.ref-type}}`
* `ref-name`: `${{steps.my_step.outputs.ref-name}}`
* `ref`: `${{steps.my_step.outputs.ref}}`

Since we declared the [`output`](https://docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs) block in `my_job`,
one of the variables (`ref`) is also exposed (as `full-ref`) to the dependent job `my_dependent_job`:
