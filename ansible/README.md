# VII. Automatisation avec Ansible

## 25. Installer Ansible sur la VM d'administration

La structure se trouve dans `ansible/` :

```text
ansible/
├── ansible.cfg
├── inventory.ini
├── README.md
└── playbooks/
    ├── install-package.yml
    └── install-docker.yml
```

Sur la VM dédiée à l'administration :

```bash
sudo apt update
sudo apt install -y ansible openssh-client
ansible --version
```

[Sen-Se1](images/25-install-ansible.png)

## 26. Configurer l'inventory et tester la communication SSH

Modifiez `inventory.ini` : remplacez l'adresse IP et `ansible_user` par les valeurs réelles de la VM cible. La connexion SSH par clé doit être configurée au préalable. Exemple à adapter :

```bash
ssh-copy-id houssem@192.168.122.125
ssh houssem@192.168.122.125
ansible all -m ping
```

Résultat attendu si la connexion fonctionne :

```text
ubuntu-target | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Ce résultat est illustratif. Capturez le résultat réel de votre terminal.

[Sen-Se1](images/26-test-ansible-pin.png)

## 27. Installer curl et git

Depuis le dossier `ansible/` :

```bash
ansible-playbook -i inventory.ini playbooks/install-package.yml
```
[Sen-Se1](images/27-install-package.png)

## 28. Installer Docker sur une VM Ubuntu

```bash
ansible-playbook -i inventory.ini playbooks/install-docker.yml
ansible -i inventory.ini portfolio_servers -b -m command -a "docker --version"
ansible -i inventory.ini portfolio_servers -b -m command -a "docker compose version"
```

Le playbook installe `docker.io` et `docker-compose-v2` depuis les dépôts Ubuntu, puis active le service. Vérifiez la présence des paquets dans les dépôts de votre version Ubuntu avant l'exécution.

## Captures à ajouter au README principal

- Capture 25 : `ansible --version`.
- Capture 26 : `inventory.ini` et la commande de ping Ansible (ne montrez jamais une clé privée).
- Capture 27 : l'exécution complète du playbook d'installation de `curl` et `git`.
- Capture 28 : l'exécution du playbook Docker et la sortie de `docker --version`.
