# pOOBs4-host

Host for PS4 Jailbreak based on Leeful [PS-Phive! 9.00 v3](https://github.com/Leeful/leeful.github.io/tree/master/ps-phive), rewritten with maintainability in mind and integration with my other project [pOOBs4-buildroot](https://github.com/Shivelight/pOOBs4-buildroot).

## Features

- Offline Cache
- Autoload Payload
- Multiversion Payload
- Easy to Expand (see [menu.json](public/menu.json))

## Payloads

Only basic and crucial payloads are included. Please use payload loader like Payload Guest if needed.

### Main

- GoldHEN
- BinLoader
- Orbis Toolbox
- Disable ASLR

### Tools

- History Blocker
- Enable Update
- Disable Update

### Backup

- Database Backup
- Database Restore

### Dumper

- Dump Game & Update
- Dump Game Only
- Dump Update Only
- Dump & Merge Game + Update

## Building

```console
pnpm install
pnpm run build
```

Build directory can be found at `dist/`.

## Todo

- [ ] Mira Payload
- [ ] Linux Payload
- [ ] Integration with pOOBs4-buildroot
