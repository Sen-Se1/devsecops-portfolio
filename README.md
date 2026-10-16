# Déploiement Ansible du Portfolio DevSecOps

Ce document décrit le processus de déploiement du portfolio DevSecOps utilisant Ansible, organisé en trois parties : Prérequis, Partie A (Playbook Ansible en ligne de commande) et Partie B (Industrialisation avec Semaphore UI).

## Prérequis

Avant de commencer le déploiement, assurez-vous d'avoir les éléments suivants installés et configurés :

![Prérequis 1](/images/01-create-ssh-key.png)
![Prérequis 2](/images/02-ssh-from-machine.png)
![Prérequis 3](/images/03-test-ansible-connection.png)

### 1. Machine de contrôle
- Système d'exploitation : Linux (Ubuntu/Debian recommandé) ou macOS avec WSL2
- Ansible installé (version 2.9 ou supérieure)
- Accès SSH vers le serveur cible

### 2. Serveur cible
- Système d'exploitation : Ubuntu 20.04 LTS ou supérieur
- Utilisateur avec privilèges sudo
- Connexion réseau accessible depuis la machine de contrôle
- **Important** : Le fichier sudoers doit être créé sur le serveur cible (192.168.122.125)

### 3. Prérequis logiciels
- Git installé sur la machine de contrôle
- Clé SSH configurée pour l'authentification sans mot de passe vers le serveur cible
- Accès au référentiel Git contenant le code du portfolio

**Étapes détaillées pour les prérequis :**
1. **Création de la clé SSH** : Générez une paire de clés SSH sur votre machine de copie et copiez la clé publique sur le serveur cible dans le fichier `~/.ssh/authorized_keys` de l'utilisateur cible
2. **Machine source** : Notez que l'image 2.png montre la machine depuis laquelle vous vous connectez en SSH (la machine de contrôle)
3. **Test de connexion** : Testez exactement comme Ansible le ferait, depuis l'extérieur (machine de contrôle vers serveur cible)

## Partie A : Playbook Ansible (ligne de commande)
 here part of explain all file in portfolio-deploy folder

run ansible commands
![Partie A](/images/04-run-ansible-commands.png)
ansible playbook 1st result
![Partie A](/images/05-ansible-playbook-result.png)
ansible second run
![Partie A](/images/06-ansible-second-run.png)
deploy result
![Partie A](/images/07-deploy-result.png)


## Partie B : Industrialisation avec Semaphore UI

create semaphore project
![Partie B](/images/08-semaphore-create-project.png)
get private key
![Partie B](/images/09-private-key.png)
create semaphore key store
![Partie B](/images/10-semaphore-create-key-store.png)
create semaphore repository
![Partie B](/images/11-semaphore-repository-setup.png)
create semaphore inventory
![Partie B](/images/12-semaphore-inventory-setup.png)
create semaphore variable config
![Partie B](/images/13-semaphore-variable-config.png)
create semaphore template
![Partie B](/images/14-semaphore-create-template.png)
create semaphore survey variable
![Partie B](/images/15-semaphore-survey-variable.png)
1st run
![Partie B](/images/16-1st-run.png)
result of 1st run
![Partie B](/images/17-1st-result.png)
2nd run
![Partie B](/images/18-2nd-run.png)
result of 2nd run
![Partie B](/images/19-2nd-result.png)


## Conclusion

