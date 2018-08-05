## Ansibe
The core of oneliner bootstrap is [Ansible](https://www.ansible.com), nice tool to perform automation. 

If you hit into some error during Ansible playbook - you can correct it and re-run playbook with 
```
ansible-playbook --diff -l "localhost" $HOME/.transmute/git/transmute/ansible-playbook/transmute.yml
```

To perform some debugging, you may execute Ansible in verbose mode, for example 
```
ansible-playbook --diff --verbose -l "localhost" $HOME/.transmute/git/transmute/ansible-playbook/transmute.yml
```

If you hit bootstrap problems and fixed it with playbook changes - please [submit a PR](https://github.com/transmute-industries/transmute/pulls)

If you cannot bootstrap with this oneliner - please [file a bug](https://github.com/transmute-industries/transmute/issues)
